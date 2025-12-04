'use client';

import { Modal, ModalContent } from '@heroui/react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import React, { useEffect, useState } from 'react';
import { formatEther } from 'viem';

import { ClaimTokenButton } from '@/components/launchpad/ClaimTokenButton';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useAuthStore } from '@/stores/authStore';

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
  const { authenticated, logout } = usePrivy();
  const { wallets } = useWallets();
  const { authInfo } = useWalletAuth(); // 获取 Privy 的 X/Twitter 用户信息
  // console.log('authInfo', authInfo);

  // 图片加载错误状态
  const [avatarError, setAvatarError] = useState(false);
  const [mainAvatarError, setMainAvatarError] = useState(false);

  // 获取钱包地址
  const walletAddress = wallets[0]?.address || '';
  const formattedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : 'Not Connected';

  // 优先使用 X/Twitter 信息，否则使用钱包地址
  const displayName = authInfo?.name || authInfo?.username || formattedAddress;
  const displayAvatar = authInfo?.avatar;

  // 获取 Token 余额
  const { balance: tokenBalance, refetch: refetchBalance } = useTokenBalance();
  const formattedTokenBalance = tokenBalance
    ? parseFloat(formatEther(tokenBalance)).toFixed(2)
    : '0.00';

  // 每次打开弹窗时刷新余额
  useEffect(() => {
    if (isOpen) {
      refetchBalance();
    }
  }, [isOpen, refetchBalance]);

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

  // 跳转到区块链浏览器
  const handleViewOnExplorer = () => {
    if (walletAddress) {
      window.open(
        `https://sepolia.basescan.org/address/${walletAddress}`,
        '_blank',
      );
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

  // 当 authInfo 变化时重置头像错误状态
  useEffect(() => {
    setAvatarError(false);
    setMainAvatarError(false);
  }, [authInfo?.avatar]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      backdrop="transparent"
      className="dark"
      hideCloseButton
      isDismissable={true}
      classNames={{
        wrapper:
          'md:justify-end md:items-center !overflow-hidden !items-start md:!items-center !justify-start md:!justify-end',
        base: 'm-0 !w-[70%] md:!w-[368px] rounded-none md:rounded-[12px] !static !transition-none !h-full md:!h-[85vh] !mr-auto md:!mr-[40px] md:!ml-auto',
        body: 'p-0',
        backdrop: 'md:hidden',
      }}
      style={{
        height: '100vh',
        maxHeight: '100vh',
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
        className="overflow-hidden rounded-none border border-[#2DC3D9] bg-transparent p-0 backdrop-blur-md !transition-none md:h-[90vh] md:w-[368px] md:rounded-[12px]"
        style={{ height: '100vh' }}
      >
        {(onCloseModal: () => void) => (
          <div className="relative flex h-full flex-col overflow-hidden">
            {/* 移动端顶部关闭按钮区域 */}
            <div className="flex h-14 shrink-0 items-center justify-end border-b border-[#2DC3D9]/20 px-4 md:hidden">
              <button
                onClick={onCloseModal}
                className="flex size-10 items-center justify-center text-white transition-colors hover:text-[#60A5FA]"
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Header - X 用户信息和关闭按钮（桌面端） */}
            <div className="relative hidden items-center justify-between border-b border-[#2DC3D9]/20 px-6 py-4 md:flex">
              {authInfo && (authInfo.username || authInfo.avatar) ? (
                <div className="flex items-center gap-3">
                  {authInfo.avatar && !avatarError ? (
                    <div className="relative size-10 overflow-hidden rounded-full shadow-lg shadow-[#60A5FA]/30 md:size-12">
                      <img
                        src={authInfo.avatar}
                        alt={authInfo.username || authInfo.name || 'User'}
                        className="size-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    </div>
                  ) : (
                    <div className="relative size-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg shadow-[#60A5FA]/30 md:size-12">
                      <div className="flex size-full items-center justify-center">
                        <span className="text-base font-semibold text-white md:text-lg">
                          {authInfo.username?.charAt(0).toUpperCase() ||
                            authInfo.name?.charAt(0).toUpperCase() ||
                            'U'}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col">
                    {authInfo.username ? (
                      <span className="text-sm font-semibold text-white md:text-base">
                        @{authInfo.username}
                      </span>
                    ) : authInfo.name ? (
                      <span className="text-sm font-semibold text-white md:text-base">
                        {authInfo.name}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative size-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg shadow-[#60A5FA]/30 md:size-12">
                    <div className="flex size-full items-center justify-center">
                      <span className="text-base font-semibold text-white md:text-lg">
                        {displayName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white md:text-base">
                      {displayName || 'User'}
                    </span>
                  </div>
                </div>
              )}
              {/* 关闭按钮 */}
              <button
                onClick={onCloseModal}
                className="cursor-pointer text-[20px] font-light text-[#60A5FA] transition-colors hover:text-gray-300 md:text-[24px]"
              >
                ✕
              </button>
            </div>

            <div className="flex h-full flex-col overflow-y-auto p-4 md:p-8">
              {/* 标题 */}
              <h2 className="mb-6 text-center text-xl font-semibold text-white md:mb-8 md:text-2xl">
                My Profile
              </h2>

              {/* 用户头像和钱包地址 */}
              <div className="mb-6 flex flex-col items-center md:mb-8">
                <div className="relative mb-3 size-16 overflow-hidden rounded-full shadow-lg shadow-[#60A5FA]/30 md:mb-4 md:size-20">
                  {displayAvatar && !mainAvatarError ? (
                    // 优先显示 X/Twitter 头像
                    <img
                      src={displayAvatar}
                      alt={displayName || 'User'}
                      className="size-full object-cover"
                      onError={() => setMainAvatarError(true)}
                    />
                  ) : authenticated && walletAddress ? (
                    // 如果没有 X/Twitter 头像，显示钱包头像（基于地址生成）
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                      <span className="text-xl font-semibold text-white md:text-2xl">
                        {walletAddress.slice(2, 4).toUpperCase()}
                      </span>
                    </div>
                  ) : user?.avatar && !mainAvatarError ? (
                    // 如果没有钱包但有用户头像，显示用户头像
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="size-full object-cover"
                      onError={() => setMainAvatarError(true)}
                    />
                  ) : (
                    // 默认头像
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                      <span className="text-xl font-semibold text-white md:text-2xl">
                        {displayName?.charAt(0).toUpperCase() ||
                          user?.name?.charAt(0).toUpperCase() ||
                          'U'}
                      </span>
                    </div>
                  )}
                </div>
                {/* 显示名称和钱包地址 */}
                {authenticated && walletAddress ? (
                  <div className="flex flex-col items-center gap-2">
                    {/* 显示 X/Twitter 用户名 */}
                    {authInfo?.username && (
                      <h3 className="text-base font-semibold text-white md:text-lg">
                        @{authInfo.username}
                      </h3>
                    )}
                    {/* 钱包地址和复制按钮 */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleViewOnExplorer}
                        className="cursor-pointer text-xs font-medium text-gray-400 transition-colors hover:text-[#86FDE8] md:text-sm"
                        title="View on BaseScan"
                      >
                        {formattedAddress}
                      </button>
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
                  </div>
                ) : (
                  <h3 className="text-base font-semibold text-white md:text-lg">
                    {displayName || user?.name || 'User'}
                  </h3>
                )}
              </div>

              {/* My Wallet 部分 */}
              <div className="mb-6 md:mb-8">
                <h3 className="mb-3 text-sm font-medium text-white md:mb-4 md:text-base">
                  My Wallet
                </h3>
                <div className="space-y-3">
                  {/* Token Balance Display - 显示 Token 余额 */}
                  {authenticated && walletAddress && (
                    <div className="rounded-2xl border border-[#2DC3D9] bg-[#2DC3D9]/5 p-3 md:p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 md:text-sm">
                          Token Balance
                        </span>
                        <span className="text-base font-semibold text-white md:text-lg">
                          {formattedTokenBalance}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Actions Row - Faucet 和 Disconnect */}
                  <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3">
                    <ClaimTokenButton />
                    {authenticated ? (
                      <button
                        onClick={logout}
                        className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80 md:text-sm"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <div className="rounded-lg border border-[#2DC3D9] bg-transparent px-4 py-2 text-center text-xs text-gray-400 md:text-sm">
                        Not connected
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* My History 部分 */}
              <div className="flex flex-1 flex-col">
                <h3 className="mb-3 text-sm font-medium text-white md:mb-4 md:text-base">
                  My History
                </h3>
                <div className="flex flex-col gap-3 md:gap-4">
                  {/* Participations 按钮 */}
                  <button
                    onClick={handleParticipations}
                    className="flex w-full items-center gap-3 rounded-2xl border-2 border-[#2DC3D9] bg-transparent px-4 py-3.5 transition-all duration-200 hover:bg-[#2DC3D9]/10 md:gap-4 md:px-5 md:py-4"
                  >
                    {/* 复选框图标 */}
                    <div className="relative flex size-6 shrink-0 items-center justify-center md:size-7">
                      <svg
                        className="size-full"
                        viewBox="0 0 20 20"
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
                          x="3"
                          y="3"
                          width="14"
                          height="14"
                          rx="2"
                          stroke="url(#participationsGradient)"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        {/* 复选框勾选 */}
                        <path
                          d="M6 10L9 13L14 6"
                          stroke="url(#participationsGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-base font-medium text-white md:text-lg">
                      Participations
                    </span>
                  </button>

                  {/* Creations 按钮 */}
                  <button
                    onClick={handleCreations}
                    className="flex w-full items-center gap-3 rounded-2xl border-2 border-[#2DC3D9] bg-transparent px-4 py-3.5 transition-all duration-200 hover:bg-[#2DC3D9]/10 md:gap-4 md:px-5 md:py-4"
                  >
                    {/* 文档图标 */}
                    <div className="flex size-5 shrink-0 items-center justify-center md:size-6">
                      <svg
                        className="size-full"
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
                    <span className="text-base font-medium text-white md:text-lg">
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
