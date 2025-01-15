"use client";

import LotteryDashboard from "@/app/components/LotteryDashboard";
import { useLottery } from "@/app/contexts/LotteryContext";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const { lottery } = params;
  const { lotteries } = useLottery();
  const lotteryDetails = lotteries.find((lot) => lot.address === lottery);
  return <LotteryDashboard lotteryDetails={lotteryDetails} />;
}
