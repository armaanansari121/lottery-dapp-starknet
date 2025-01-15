import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { LotteryDetails, LotterySection } from "../types";
import { formatTokenAmount, shortenAddress } from "../utils";

export const LotteryCard = ({
  lottery,
  router,
  activeSection,
}: {
  lottery: LotteryDetails;
  router: AppRouterInstance;
  activeSection: LotterySection;
}) => (
  <div
    onClick={() => router.push(`/lotteries/${lottery.address}`)}
    className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 space-y-2 hover:border-purple-300 transition-colors cursor-pointer"
  >
    <div>Token: {lottery.token.name}</div>

    <div>
      Entry Fee:{" "}
      {formatTokenAmount(
        lottery.participant_fees,
        lottery.token.decimals,
        lottery.token.symbol
      )}
    </div>

    <div>Contract Address: {shortenAddress(lottery.address)}</div>

    {activeSection === "past" && (
      <div>Winner: {shortenAddress(lottery.winner)}</div>
    )}
  </div>
);
