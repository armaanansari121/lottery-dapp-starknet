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

export interface LotteryContextType {
  lotteries: LotteryDetails[];
  loading: boolean;
  filteredLotteries: LotteryDetails[];
  activeSection: LotterySection;
  myLotteryType: MyLotteryType;
  setActiveSection: (section: LotterySection) => void;
  setMyLotteryType: (type: MyLotteryType) => void;
  createLottery: (token: string, participantFees: string) => Promise<void>;
  enrollInLottery: (
    lotteryAddress: string,
    participantFees: string,
    token: string
  ) => Promise<void>;
  selectWinner: (lotteryAddress: string) => Promise<void>;
  withdrawOracleFees: (lotteryAddress: string) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshLotteries: () => Promise<any[]>;
}

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
