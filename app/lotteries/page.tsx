"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import {
  ETH_TOKEN_ADDRESS,
  factory_contract,
  KNOWN_TOKENS,
  LOTTERY_FACTORY_ADDRESS,
  PRAGMA_VRF_FEES,
  provider,
} from "../constants";
import { cairo, CallData, Contract } from "starknet";
import { LotteryABI } from "../abi";
import {
  FetchedLottery,
  LotteryDetails,
  LotteryState,
  TokenDetails,
} from "../types";

function getRandomNumber() {
  return Math.floor(Math.random() * 1000000);
}

function convertToStarknetAddress(address: bigint) {
  return "0x" + address.toString(16).padStart(64, "0");
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function decimalToText(decimal: bigint): string {
  const hex = decimal.toString(16);
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

// Utility function to format token amount
function formatTokenAmount(
  amount: bigint,
  decimals: number,
  symbol: string
): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;

  // Convert fractional part to string and pad with leading zeros
  let fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  // Remove trailing zeros
  fractionalStr = fractionalStr.replace(/0+$/, "");

  // If no fractional part, return just the integer
  if (!fractionalStr) {
    return `${integerPart} ${symbol}`;
  }

  return `${integerPart}.${fractionalStr} ${symbol}`;
}

// Cache to store token details
const tokenDetailsCache: Map<string, TokenDetails> = new Map();

export default function Home() {
  const { account } = useAccount();
  const router = useRouter();
  const [lotteries, setLotteries] = useState<LotteryDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    token: ETH_TOKEN_ADDRESS,
    participant_fees: "",
  });
  const [customToken, setCustomToken] = useState("");
  const [selectedTokenType, setSelectedTokenType] = useState<
    "known" | "custom"
  >("known");

  async function createLottery(e: React.FormEvent) {
    e.preventDefault();
    try {
      const selectedToken =
        KNOWN_TOKENS.find((t) => t.address === formData.token) ||
        (await getTokenDetails(formData.token));
      // Convert from human readable amount to wei
      const amount = BigInt(
        Math.floor(
          parseFloat(formData.participant_fees) *
            Math.pow(10, selectedToken.decimals)
        )
      );
      const multiCall = await account?.execute([
        {
          contractAddress: ETH_TOKEN_ADDRESS,
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: LOTTERY_FACTORY_ADDRESS,
            amount: cairo.uint256(PRAGMA_VRF_FEES),
          }),
        },
        {
          contractAddress: LOTTERY_FACTORY_ADDRESS,
          entrypoint: "create_lottery",
          calldata: CallData.compile({
            token: formData.token,
            participant_fees: cairo.uint256(amount),
            salt: getRandomNumber(),
          }),
        },
      ]);
      await provider.waitForTransaction(multiCall?.transaction_hash || "");
      fetchLotteries(); // Refresh the list
    } catch (error) {
      console.error("Error creating lottery:", error);
    }
  }

  // Function to fetch token details with caching
  async function getTokenDetails(tokenAddress: string): Promise<TokenDetails> {
    // Check if details are already in cache
    const cachedDetails = tokenDetailsCache.get(tokenAddress);
    if (cachedDetails) {
      console.log("Using cached token details for:", tokenAddress);
      return cachedDetails;
    }

    const { abi: ERC20Abi } = await provider.getClassAt(tokenAddress);
    // Create token contract instance
    const tokenContract = new Contract(
      ERC20Abi,
      tokenAddress,
      provider
    ).typedv2(ERC20Abi);

    let [symbol, name, decimals] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.name(),
      tokenContract.decimals(),
    ]);

    name = decimalToText(name);
    symbol = decimalToText(symbol);
    decimals = Number(decimals);

    try {
      const tokenDetails: TokenDetails = {
        address: tokenAddress,
        name,
        symbol,
        decimals,
      };

      // Store in cache
      tokenDetailsCache.set(tokenAddress, tokenDetails);
      console.log("Fetched and cached token details for:", tokenAddress);

      return tokenDetails;
    } catch (error) {
      console.error(`Error fetching token details for ${tokenAddress}:`, error);
      // Return a default object with the address in case of error
      return {
        address: tokenAddress,
        name: "Unknown Token",
        symbol: "???",
        decimals: 18,
      };
    }
  }

  const fetchLotteryDetails = useCallback(async (lotteryAddress: string) => {
    try {
      const lotteryContract = new Contract(
        LotteryABI,
        lotteryAddress,
        provider
      ).typedv2(LotteryABI);

      const details = await lotteryContract.get_lottery_details();
      const participants = details[1].map((participant: bigint) =>
        convertToStarknetAddress(participant)
      );

      // Get token address in the correct format
      const tokenAddress = convertToStarknetAddress(details[2]);

      // Fetch token details
      const tokenDetails = await getTokenDetails(tokenAddress);

      let state;
      if (details[5].variant.Active) {
        state = LotteryState.ACTIVE;
      } else if (details[5].variant.WinnerSelected) {
        state = LotteryState.WINNER_SELECTED;
      } else {
        state = LotteryState.CLOSED;
      }

      return {
        address: lotteryAddress,
        owner: convertToStarknetAddress(details[0]),
        participants,
        token: tokenDetails,
        participant_fees: details[3],
        winner:
          details[4] == BigInt(0)
            ? "No winner yet"
            : convertToStarknetAddress(details[4]),
        state,
      };
    } catch (error) {
      console.error(
        `Error fetching details for lottery ${lotteryAddress}:`,
        error
      );
      return null;
    }
  }, []);

  const fetchLotteries = useCallback(async () => {
    try {
      // Get all lottery addresses from factory
      const lotteryAddresses = await factory_contract.get_lotteries();

      // Convert addresses and create promises for parallel fetching
      const detailPromises = lotteryAddresses.map((lottery: FetchedLottery) => {
        const starknetAddress = convertToStarknetAddress(
          lottery.lottery_address
        );
        return fetchLotteryDetails(starknetAddress);
      });

      // Fetch all details in parallel
      const allDetails = await Promise.allSettled(detailPromises);

      // Process results
      const successfulFetches = allDetails
        .filter(
          (result) => result.status === "fulfilled" && result.value !== null
        )
        // @ts-expect-error...
        .map((result) => result.value);

      // Update state with basic lottery info for the table
      setLotteries(successfulFetches.reverse());

      return successfulFetches;
    } catch (error) {
      console.error("Error fetching lotteries:", error);
      setLotteries([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchLotteryDetails]);

  useEffect(() => {
    fetchLotteries();
  }, [fetchLotteries]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 min-h-screen bg-purple-100">
      {/* Lotteries Table Section */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-purple-200">
            <h2 className="text-2xl font-semibold text-purple-900">
              Active Lotteries
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-900">
                    Lottery Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-900">
                    Token
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-900">
                    Entry Fee
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-purple-700"
                    >
                      Loading lotteries...
                    </td>
                  </tr>
                ) : lotteries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-purple-700"
                    >
                      No active lotteries found
                    </td>
                  </tr>
                ) : (
                  lotteries.map((lottery: LotteryDetails, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        router.push(`/lotteries/${lottery.address}`)
                      }
                      className="hover:bg-purple-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-purple-900 font-mono">
                        {shortenAddress(lottery.address)}
                      </td>
                      <td className="px-6 py-4 text-sm text-purple-900">
                        {lottery.token.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-purple-900">
                        {formatTokenAmount(
                          lottery.participant_fees,
                          lottery.token.decimals,
                          lottery.token.symbol
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Lottery Form Section */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-purple-900 mb-6">
            Create New Lottery
          </h2>
          <form onSubmit={createLottery} className="space-y-4">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-purple-900">
                ERC20 Token Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedTokenType("known")}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    selectedTokenType === "known"
                      ? "border-purple-500 bg-purple-50 text-purple-900"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Known Tokens
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTokenType("custom")}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    selectedTokenType === "custom"
                      ? "border-purple-500 bg-purple-50 text-purple-900"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Other Tokens
                </button>
              </div>
            </div>

            {selectedTokenType === "known" ? (
              <div>
                <label className="block text-sm font-medium text-purple-900 mb-2">
                  Select Token
                </label>
                <select
                  value={formData.token}
                  onChange={(e) =>
                    setFormData({ ...formData, token: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {KNOWN_TOKENS.map((token) => (
                    <option key={token.address} value={token.address}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-purple-900 mb-2">
                  ERC20 Token Address
                </label>
                <input
                  type="text"
                  value={customToken}
                  onChange={(e) => {
                    setCustomToken(e.target.value);
                    setFormData({ ...formData, token: e.target.value });
                  }}
                  className="w-full p-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter ERC20 contract address"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-purple-900 mb-2">
                Entry Fee
              </label>
              <input
                type="text"
                value={formData.participant_fees}
                onChange={(e) =>
                  setFormData({ ...formData, participant_fees: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter amount (e.g., 0.5)"
              />
            </div>

            <button
              type="submit"
              disabled={
                !account || !formData.participant_fees || !formData.token
              }
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Lottery
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
