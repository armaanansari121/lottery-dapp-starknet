"use client";
import "./globals.css";
import { StarknetProvider } from "./components/StarknetProvider";
import { Navbar } from "./components/Navbar";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = "Starknet Lottery";
    document.head
      .querySelector("link[rel='icon']")
      ?.setAttribute("href", "/starknet.svg");
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen bg-purple-100">
        <StarknetProvider>
          <Navbar />
          <main className="w-full">{children}</main>
        </StarknetProvider>
      </body>
    </html>
  );
}
