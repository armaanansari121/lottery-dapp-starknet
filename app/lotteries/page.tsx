// pages/index.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import { KNOWN_TOKENS } from "../constants";
import { LotteryCard } from "../components/LotteryCard";
import { useLottery } from "../contexts/LotteryContext";
import { shortenAddress, formatTokenAmount } from "../utils";
import Loader from "../components/Loader";
import Image from "next/image";

export function Home() {
  const router = useRouter();
  const { account } = useAccount();
  const {
    loading,
    filteredLotteries,
    activeSection,
    myLotteryType,
    setActiveSection,
    setMyLotteryType,
    createLottery,
  } = useLottery();

  const [formData, setFormData] = useState({
    token: KNOWN_TOKENS[0].address,
    participant_fees: "",
  });
  const [customToken, setCustomToken] = useState("");
  const [selectedTokenType, setSelectedTokenType] = useState<
    "known" | "custom"
  >("known");

  const handleCreateLottery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLottery(formData.token, formData.participant_fees);
      // Reset form after successful creation
      setFormData({ token: KNOWN_TOKENS[0].address, participant_fees: "" });
      setCustomToken("");
    } catch (error) {
      console.error("Error creating lottery:", error);
    }
  };

  return (
    <div className="flex lg:flex-row flex-col gap-8 p-4 md:p-6 min-h-screen bg-purple-100">
      {/* Lotteries Section */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Section Selector */}
          <div className="border-b border-purple-200">
            <div className="flex overflow-x-auto whitespace-nowrap">
              <button
                onClick={() => setActiveSection("active")}
                className={`flex-1 px-4 py-4 text-center border-b-2 transition-colors ${
                  activeSection === "active"
                    ? "border-purple-600 text-purple-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Active Lotteries
              </button>
              <button
                onClick={() => setActiveSection("past")}
                className={`flex-1 px-4 py-4 text-center border-b-2 transition-colors ${
                  activeSection === "past"
                    ? "border-purple-600 text-purple-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Past Lotteries
              </button>
              <button
                onClick={() => {
                  setActiveSection("my");
                  setMyLotteryType("enrolled");
                }}
                className={`flex-1 px-4 py-4 text-center border-b-2 transition-colors ${
                  activeSection === "my" && myLotteryType === "enrolled"
                    ? "border-purple-600 text-purple-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Enrolled Lotteries
              </button>
              <button
                onClick={() => {
                  setActiveSection("my");
                  setMyLotteryType("created");
                }}
                className={`flex-1 px-4 py-4 text-center border-b-2 transition-colors ${
                  activeSection === "my" && myLotteryType === "created"
                    ? "border-purple-600 text-purple-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Created Lotteries
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-8 text-center text-purple-700">
              <Loader isLoading={true} />
            </div>
          ) : filteredLotteries.length === 0 ? (
            <div className="p-8 text-center text-purple-700">
              No lotteries found
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="lg:hidden p-4 space-y-3">
                {filteredLotteries.map((lottery, index) => (
                  <LotteryCard
                    key={index}
                    lottery={lottery}
                    router={router}
                    activeSection={activeSection}
                  />
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
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
                      <th className="px-6 py-4 text-left text-sm font-medium text-purple-900">
                        Current Pot
                      </th>
                      {activeSection === "past" && (
                        <th className="px-6 py-4 text-left text-sm font-medium text-purple-900">
                          Winner
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {filteredLotteries.map((lottery, index) => (
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
                          {lottery.token.logo ? (
                            <div className="flex items-center gap-2">
                              <Image
                                src={lottery.token.logo}
                                alt="Token Logo"
                                width={16}
                                height={16}
                              />
                              {lottery.token.name}
                            </div>
                          ) : (
                            lottery.token.name
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-purple-900">
                          {formatTokenAmount(
                            lottery.participant_fees,
                            lottery.token.decimals,
                            lottery.token.symbol
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-purple-900">
                          {formatTokenAmount(
                            lottery.participant_fees *
                              BigInt(lottery.participants.length),
                            lottery.token.decimals,
                            lottery.token.symbol
                          )}
                        </td>
                        {activeSection === "past" && (
                          <td className="px-6 py-4 text-sm text-purple-900">
                            {shortenAddress(lottery.winner)}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Lottery Form Section */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
          <h2 className="text-2xl font-semibold text-purple-900 mb-6">
            Create New Lottery
          </h2>
          <form onSubmit={handleCreateLottery} className="space-y-4">
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

export default Home;
