export type FetchedLottery = {
  token: bigint;
  participation_fee: bigint;
  lottery_address: bigint;
};

export type LotteryDetails = {
  address: string;
  owner: string;
  participants: string[];
  token: TokenDetails;
  participant_fees: bigint;
  winner: string;
  state: LotteryState;
};

export type TokenDetails = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
};

export enum LotteryState {
  ACTIVE = 0,
  WINNER_SELECTED = 1,
  CLOSED = 2,
}

export interface TokenOption {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export type LotterySection = "active" | "past" | "my";
export type MyLotteryType = "enrolled" | "created";
