import { Contract, RpcProvider } from "starknet";
import { FactoryABI } from "./abi";
import { TokenOption } from "./types";

export const LOTTERY_FACTORY_ADDRESS =
  "0x00cfd32cb1fe08669eaf6ec9c00935f5a03526a5bd38af62d26c3b574dd99412";
export const ETH_TOKEN_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const STRK_TOKEN_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

export const PRAGMA_VRF_FEES = BigInt("20000000000000000");

export const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

export const factory_contract = new Contract(
  FactoryABI,
  LOTTERY_FACTORY_ADDRESS,
  provider
).typedv2(FactoryABI);

export const KNOWN_TOKENS: TokenOption[] = [
  { address: ETH_TOKEN_ADDRESS, name: "Ethereum", symbol: "ETH", decimals: 18 },
  {
    address: STRK_TOKEN_ADDRESS,
    name: "Starknet Token",
    symbol: "STRK",
    decimals: 18,
  },
];
