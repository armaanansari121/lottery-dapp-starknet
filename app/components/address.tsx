"use client";

import { useAccount } from "@starknet-react/core";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import userIcon from "../../public/user.png";
import DisconnectModal from "./disconnect-modal";
import { useState } from "react";

interface AddressProps {
  isMobile?: boolean;
}

const Address: React.FC<AddressProps> = ({ isMobile = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div
      className={`
      flex items-center gap-2 rounded-lg max-w-full overflow-x-auto
      ${isMobile ? "w-full" : ""}
    `}
    >
      <div
        className={`
        flex items-center gap-2 w-full
        ${isMobile ? "flex-row" : "flex-col sm:flex-row sm:gap-3"}
      `}
      >
        <div
          className={`
          flex bg-[#E6E6FA] justify-between items-center gap-2 rounded-full
          ${
            isMobile
              ? "w-full px-6 py-3"
              : "px-4 sm:px-6 py-2 sm:py-2 sm:w-auto"
          }
        `}
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <Image
              src={userIcon}
              alt="User icon"
              width={20}
              height={20}
              className={`
              ${isMobile ? "w-6 h-6" : "w-5 h-5 sm:w-6 sm:h-6"}
              `}
            />
            <div className="flex-shrink min-w-0">
              <span
                className={`
                text-[#483D8B] truncate
                ${isMobile ? "text-base" : "text-sm sm:text-base"}
                `}
              >
                {address ? shortenAddress(address) : ""}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 hover:bg-[#9370DB] rounded transition-colors ml-1"
          >
            <MoreVertical
              className={`
              text-[#483D8B]
              ${isMobile ? "w-5 h-5" : "w-4 h-4 sm:w-5 sm:h-5"}
            `}
            />
          </button>
          <DisconnectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </div>
      </div>
    </div>
  );
};

export default Address;
