"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { X } from "lucide-react";
import { useLottery } from "../contexts/LotteryContext";

interface RegisterModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function RegisterModal({
  isOpen,
  setIsOpen,
}: RegisterModalProps) {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { createProfile } = useLottery();

  const handleClose = () => setIsOpen(false);

  const uploadToIPFS = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.ipfsHash;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleRegister = async () => {
    try {
      let ipfsHash = "";
      if (selectedFile) {
        ipfsHash = await uploadToIPFS(selectedFile);
      }

      await createProfile(username, ipfsHash, bio);
      handleClose();
    } catch (error) {
      console.error("Error registering:", error);
    }
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-lg transition-all">
                <div className="border-b border-purple-200 p-6">
                  <div className="flex relative justify-center items-center">
                    <Dialog.Title className="text-2xl font-semibold text-purple-900">
                      Register Profile
                    </Dialog.Title>
                    <button
                      onClick={handleClose}
                      className="absolute right-0 text-gray-500 hover:text-purple-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Bio
                    </label>
                    <textarea
                      placeholder="Tell us about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      className="w-full p-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={!username || isUploading}
                    className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? "Uploading..." : "Register"}
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
