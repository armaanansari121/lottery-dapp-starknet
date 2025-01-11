"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
import { useDisconnect } from "@starknet-react/core";

interface DisconnectWalletModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DisconnectModal({
  isOpen,
  setIsOpen,
}: DisconnectWalletModalProps) {
  const { disconnect } = useDisconnect();
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
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
              <Dialog.Panel className="w-full text-center max-w-md md:max-w-[800px] transform rounded-3xl bg-white border border-[#E6E6FA] p-8 shadow-xl transition-all">
                <div className="flex relative justify-center mt-5 text-center items-center mb-3 lg:mb-5">
                  <Dialog.Title
                    as="h3"
                    className="text-[18px] lg:text-2xl font-medium text-[#483D8B]"
                  >
                    Disconnect wallet
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-[#9370DB] hover:text-[#483D8B] absolute right-5 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="py-[30px] px-[16px] lg:py-[81px] lg:px-[55px] my-4 lg:my-6">
                  <p className="text-[#483D8B] text-sm lg:text-base">
                    You are disconnecting your wallet. Are you sure you want to
                    continue with this process?
                  </p>
                </div>

                <div className="items-center grid grid-cols-[1fr_1fr] gap-x-4">
                  <button
                    className={`py-3 text-sm lg:text-base lg:py-4 rounded-full hover:bg-[#9370DB] bg-[#E6E6FA] text-[#483D8B] transition-colors`}
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="py-3 text-sm lg:text-base lg:py-4 rounded-full bg-[#9370DB] hover:bg-[#483D8B] text-white transition-colors"
                    onClick={handleDisconnect}
                  >
                    Yes, Disconnect
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
