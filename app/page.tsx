"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronDown,
  Ticket,
  Shield,
  Zap,
  Users,
  Award,
  Scale,
} from "lucide-react";
import StarknetLogo from "../public/starknet.svg";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const detailsOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const detailsY = useTransform(scrollYProgress, [0.2, 0.4], [100, 0]);

  return (
    <div className="relative bg-purple-100 text-purple-900 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="space-y-6 mb-2">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight">
              Lucky StarK
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-purple-700 max-w-2xl mx-auto">
              Experience the future of decentralized lotteries powered by
              Starknet&apos;s cutting-edge technology
            </p>
          </div>

          <Link href="/lotteries">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
            >
              Start Playing
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10"
        >
          <ChevronDown size={32} className="text-purple-600" />
        </motion.div>
      </motion.section>

      {/* Details Section */}
      <motion.section
        style={{ opacity: detailsOpacity, y: detailsY }}
        className="min-h-screen py-10 sm:py-20 px-4 sm:px-6 lg:px-8 bg-purple-100"
      >
        <div className="max-w-6xl mx-auto space-y-10 sm:space-y-20">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16">
              How It Works
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
              {[
                {
                  icon: (
                    <Ticket className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                  ),
                  title: "Join & Play",
                  description:
                    "Enter the lottery with just a few clicks. Our smart contracts ensure complete transparency and fairness.",
                },
                {
                  icon: (
                    <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                  ),
                  title: "Secure Random Selection",
                  description:
                    "Winners are chosen using Pragma VRF technology, guaranteeing true randomness and fairness.",
                },
                {
                  icon: (
                    <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                  ),
                  title: "Instant Rewards",
                  description:
                    "Winnings are automatically transferred to your wallet the moment the lottery ends.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="bg-purple-100 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-purple-700 text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Future Plans Section */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16">
              Coming Soon
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
              {[
                {
                  icon: (
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                  ),
                  title: "1-on-1 Betting",
                  description:
                    "Challenge friends or other players to direct bets. Set your terms and compete in a secure, transparent environment.",
                },
                {
                  icon: (
                    <Scale className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                  ),
                  title: "Optimistic Oracle",
                  description:
                    "Powered by Pragma's Optimistic Oracle, ensuring fair and accurate resolution of all betting outcomes.",
                },
                {
                  icon: (
                    <Award className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                  ),
                  title: "Enhanced Rewards",
                  description:
                    "New reward mechanisms and token utilities coming soon to make your winnings even more valuable.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow border-2 border-purple-300"
                >
                  <div className="space-y-4">
                    <div className="bg-purple-100 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-purple-700 text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-8 sm:py-12 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-3xl backdrop-blur-sm"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Ready to Try Your Luck?
            </h3>
            <p className="text-purple-700 text-sm sm:text-base mb-6 sm:mb-8 max-w-xl mx-auto">
              Join thousands of players already winning on Starknet&apos;s most
              trusted lottery platform.
            </p>
            <Link href="/lotteries">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
              >
                Play Now
              </motion.button>
            </Link>
          </motion.div>

          {/* Powered by Starknet Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-8 pb-4 flex flex-col items-center justify-center"
          >
            <p className="text-purple-700 text-sm sm:text-base mb-4 sm:mb-0 sm:mr-4">
              Powered by
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <Image
                src={StarknetLogo}
                alt="Starknet"
                width={64}
                height={64}
                className="rounded-full"
              />
              <span className="text-4xl sm:text-6xl font-bold ml-4 text-black">
                STARKNET
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
