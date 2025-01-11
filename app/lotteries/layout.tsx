"use client";

import { useEffect } from "react";

export default function LotteryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = "Lotteries";
    document.head
      .querySelector("link[rel='icon']")
      ?.setAttribute("href", "/starknet.svg");
    return () => {
      document.title = "Starknet Lottery";
      document.head
        .querySelector("link[rel='icon']")
        ?.setAttribute("href", "/starknet.svg");
    };
  }, []);

  return (
    <div className="relative bg-purple-100 text-purple-900 overflow-hidden">
      {children}
    </div>
  );
}
