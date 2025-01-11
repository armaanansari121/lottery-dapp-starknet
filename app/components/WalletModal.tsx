"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useConnect, Connector } from "@starknet-react/core";
import { X } from "lucide-react";
import Image from "next/image";

interface WalletModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface WalletDetails {
  name: string;
  subtext: string;
  icon: string;
}

const walletIcons = {
  argentX: "/argent.svg",
  webwallet: "/argent.svg",
  braavos: "/braavos.svg",
} as const;

export function WalletModal({ isOpen, setIsOpen }: WalletModalProps) {
  const { connect, connectors } = useConnect();
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(
    null
  );

  const getWalletDetails = (connector: Connector): WalletDetails => {
    if (connector.id === "webwallet") {
      return {
        name: "Argent",
        subtext: "MOBILE",
        icon: walletIcons.webwallet,
      };
    }

    switch (connector.id) {
      case "argentX":
        return {
          name: "Argent",
          subtext: "WEBSITE",
          icon: walletIcons.argentX,
        };
      case "braavos":
        return {
          name: "Braavos",
          subtext: "WEBSITE",
          icon: walletIcons.braavos,
        };
      default:
        return {
          name: connector.id,
          subtext: "WEBSITE",
          icon: walletIcons.argentX,
        };
    }
  };

  const connectWallet = (connector: Connector | null) => {
    if (connector) {
      connect({ connector });
      setSelectedConnector(connector);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedConnector(null);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full text-center max-w-md md:max-w-[800px] transform rounded-3xl bg-white border border-[#E6E6FA] p-4 md:p-8 shadow-xl transition-all">
                <div className="flex relative justify-center mt-5 text-center items-center mb-5">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium text-[#483D8B]"
                  >
                    Connect wallet
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-[#9370DB] hover:text-[#483D8B] absolute right-5 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-[#483D8B] my-8">
                  Choose a wallet you want to connect
                </p>

                <div className="space-y-8 flex justify-center items-center flex-col mb-8">
                  {connectors.map((connector) => {
                    const walletDetails = getWalletDetails(connector);
                    const isSelected = selectedConnector?.id === connector.id;

                    return (
                      <button
                        key={connector.id}
                        onClick={() => connectWallet(connector)}
                        className={`w-full sm:w-[416px] flex items-center justify-between p-4 rounded-full
                          border ${
                            isSelected ? "border-[#9370DB]" : "border-[#E6E6FA]"
                          } 
                          hover:border-[#9370DB] transition-colors`}
                      >
                        <div className="flex justify-center mx-auto items-center gap-2">
                          <div className="relative w-8 h-8">
                            <Image
                              src={walletDetails.icon}
                              alt={walletDetails.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-[#483D8B] font-medium">
                              {walletDetails.name}
                            </span>
                            <span className="text-xs text-[#9370DB]">
                              {walletDetails.subtext}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  className={`w-full sm:w-[416px] mb-8 mt-10 py-4 rounded-full 
                    ${
                      selectedConnector
                        ? "bg-[#9370DB] hover:bg-[#483D8B]"
                        : "bg-[#E6E6FA] hover:bg-[#9370DB]"
                    } 
                    text-white transition-colors`}
                  onClick={() => connectWallet(selectedConnector)}
                  disabled={!selectedConnector}
                >
                  Continue
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
