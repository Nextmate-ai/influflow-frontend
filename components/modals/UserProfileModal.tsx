'use client';

import { Modal, ModalContent } from '@heroui/react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { ConnectButton, useActiveWallet } from 'thirdweb/react';
import { inAppWallet } from 'thirdweb/wallets';

import { ClaimTokenButton } from '@/components/launchpad/ClaimTokenButton';
import { THIRDWEB_CLIENT_ID, TOKEN_CONTRACT_ADDRESS } from '@/constants/env';
import { useAuthStore } from '@/stores/authStore';

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

const wallets = [
  inAppWallet({
    auth: {
      options: ['x'],
    },
  }),
];

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParticipationsClick?: () => void;
  onCreationsClick?: () => void;
}

/**
 * 用户详情弹窗 - 显示用户信息和钱包
 * 重新设计为右侧抽屉式布局
 */
export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onParticipationsClick,
  onCreationsClick,
}) => {
  const { user } = useAuthStore();
  const wallet = useActiveWallet();

  // 获取钱包地址
  const walletAddress = wallet?.getAccount()?.address || '';
  const formattedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : 'Not Connected';

  // 复制地址到剪贴板
  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        // 可以添加一个 toast 提示，这里暂时用 alert
        // alert('Address copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const handleParticipations = () => {
    onParticipationsClick?.();
    onClose();
  };

  const handleCreations = () => {
    onCreationsClick?.();
    onClose();
  };

  // 防止页面滚动
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      backdrop="transparent"
      className="dark"
      hideCloseButton
      isDismissable={false}
      classNames={{
        wrapper: 'justify-end items-center !overflow-hidden',
        base: 'm-0 !w-[400px] rounded-[12px] !static !transition-none',
        body: 'p-0',
        backdrop: 'hidden',
      }}
      style={{
        height: 'calc(100vh - 92px)',
      }}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            transition: {
              duration: 0,
            },
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0,
            },
          },
        },
      }}
    >
      <ModalContent
        className="overflow-hidden rounded-[12px] border border-[#2DC3D9] bg-transparent p-0 backdrop-blur-md !transition-none"
        style={{ height: 'calc(100vh - 92px)' }}
      >
        {(onCloseModal: () => void) => (
          <div className="relative flex h-full flex-col overflow-hidden">
            {/* 关闭按钮 */}
            <button
              onClick={onCloseModal}
              className="absolute right-6 top-6 z-10 cursor-pointer text-[24px] font-light text-[#60A5FA] hover:text-gray-300"
            >
              ✕
            </button>

            <div className="flex h-full flex-col p-8 pt-16">
              {/* 标题 */}
              <h2 className="mb-8 text-center text-2xl font-semibold text-white">
                My Profile
              </h2>

              {/* 用户头像和钱包地址 */}
              <div className="mb-8 flex flex-col items-center">
                <div className="relative mb-4 size-20 overflow-hidden rounded-full border-2 border-[#60A5FA]">
                  {wallet ? (
                    // 如果有钱包，显示钱包头像（基于地址生成）
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                      <span className="text-2xl font-semibold text-white">
                        {walletAddress
                          ? walletAddress.slice(2, 4).toUpperCase()
                          : 'W'}
                      </span>
                    </div>
                  ) : user?.avatar ? (
                    // 如果没有钱包但有用户头像，显示用户头像
                    <Image
                      src={user.avatar}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    // 默认头像
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                      <span className="text-2xl font-semibold text-white">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                {/* 钱包地址和复制按钮 */}
                {wallet && walletAddress ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {formattedAddress}
                    </span>
                    <button
                      onClick={handleCopyAddress}
                      className="cursor-pointer text-[#86FDE8] transition-colors hover:text-[#60A5FA]"
                      title="Copy address"
                    >
                      <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <h3 className="text-lg font-semibold text-white">
                    {user?.name || 'User'}
                  </h3>
                )}
              </div>

              {/* My Wallet 部分 - 替换为 Thirdweb ConnectButton */}
              <div className="mb-8">
                <h3 className="mb-4 text-base font-medium text-white">
                  My Wallet
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 [&_button]:w-full [&_button]:!rounded-2xl [&_button]:!border [&_button]:!border-[#2DC3D9] [&_button]:!bg-transparent [&_button]:!p-4 [&_button]:!transition-all [&_button]:!duration-200 [&_button]:hover:!bg-[#2DC3D9]/10">
                    <ConnectButton
                      client={client}
                      wallets={wallets}
                      accountAbstraction={{
                        chain: baseSepolia,
                        sponsorGas: true,
                      }}
                      connectModal={{
                        size: 'compact',
                      }}
                      theme="dark"
                      detailsButton={{
                        displayBalanceToken: {
                          [baseSepolia.id]: TOKEN_CONTRACT_ADDRESS,
                        },
                      }}
                    />
                  </div>
                  <ClaimTokenButton />
                </div>
              </div>

              {/* My History 部分 */}
              <div className="flex flex-1 flex-col">
                <h3 className="mb-4 text-base font-medium text-white">
                  My History
                </h3>
                <div className="flex-1 space-y-3">
                  {/* Participations 按钮 */}
                  <button
                    onClick={handleParticipations}
                    className="flex w-full items-center gap-3 rounded-2xl border border-[#2DC3D9] bg-transparent p-4 transition-all duration-200 hover:bg-[#2DC3D9]/10"
                  >
                    {/* 复选框+时钟图标 */}
                    <div className="relative flex size-6 items-center justify-center">
                      <svg
                        className="size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient
                            id="participationsGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: '#86FDE8', stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: '#2DC3D9', stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        {/* 复选框外框 */}
                        <rect
                          x="4"
                          y="4"
                          width="12"
                          height="12"
                          rx="2"
                          stroke="url(#participationsGradient)"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        {/* 复选框勾选 */}
                        <path
                          d="M7 12L9.5 14.5L17 7"
                          stroke="url(#participationsGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* 时钟背景（在复选框下方） */}
                        <circle
                          cx="10"
                          cy="18"
                          r="4"
                          stroke="url(#participationsGradient)"
                          strokeWidth="1.5"
                          fill="none"
                          opacity="0.6"
                        />
                        <path
                          d="M10 15V18H13"
                          stroke="url(#participationsGradient)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.6"
                        />
                      </svg>
                    </div>
                    <span className="text-base font-medium text-white">
                      Participations
                    </span>
                  </button>

                  {/* Creations 按钮 */}
                  <button
                    onClick={handleCreations}
                    className="flex w-full items-center gap-3 rounded-2xl border border-[#2DC3D9] bg-transparent p-4 transition-all duration-200 hover:bg-[#2DC3D9]/10"
                  >
                    {/* 文档图标 */}
                    <div className="flex size-6 items-center justify-center">
                      <svg
                        className="size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient
                            id="creationsGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: '#86FDE8', stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: '#2DC3D9', stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                          stroke="url(#creationsGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <path
                          d="M14 2V8H20"
                          stroke="url(#creationsGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 13H16"
                          stroke="url(#creationsGradient)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8 17H16"
                          stroke="url(#creationsGradient)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-base font-medium text-white">
                      Creations
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
