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
        wrapper: 'md:!flex md:!justify-end md:!items-center !overflow-hidden md:!pr-8 md:!py-4',
        base: '!m-0 !w-[70%] md:!w-[368px] !transition-none h-full md:!h-[calc(100vh-32px)]',
        body: 'p-0',
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
        className="overflow-hidden rounded-none md:rounded-[16px] border-[3px] border-[#075985] bg-[rgba(11,4,30,0.90)] p-0 backdrop-blur-[0px] !transition-none h-screen md:h-full"
      >
        {(onCloseModal: () => void) => (
          <div 
            className="relative flex flex-col overflow-hidden h-full" 
            style={{ 
              fontFamily: 'Quicksand, sans-serif'
            }}
          >
            <div className="relative flex h-full flex-col overflow-y-auto px-[27px] py-[24px]">
              {/* 关闭按钮 - 仅移动端 */}
              <button
                onClick={onCloseModal}
                className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center text-white transition-colors hover:text-[#60A5FA] md:hidden"
              >
                <svg
                  className="size-5"
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
              {/* My Profile 标题 */}
              <h2 className="mb-[20px] text-center text-[28px] font-[700] leading-[36px] text-white">
                My Profile
              </h2>

              {/* 用户头像 */}
              <div className="mb-[24px] flex flex-col items-center">
                <div className="relative mb-4">
                  {/* 外层蓝色边框 */}
                  <div className="absolute left-1/2 top-1/2 size-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-[#3461FF]" />
                  {/* 头像 */}
                  <div className="relative size-[104px] overflow-hidden rounded-full">
                    {displayAvatar && !mainAvatarError ? (
                      <img
                        src={displayAvatar}
                        alt={displayName || 'User'}
                        className="size-full object-cover"
                        onError={() => setMainAvatarError(true)}
                      />
                    ) : authenticated && walletAddress ? (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                        <span className="text-2xl font-semibold text-white">
                          {walletAddress.slice(2, 4).toUpperCase()}
                        </span>
                      </div>
                    ) : user?.avatar && !mainAvatarError ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="size-full object-cover"
                        onError={() => setMainAvatarError(true)}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                        <span className="text-2xl font-semibold text-white">
                          {displayName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 用户名 */}
                <h3 className="mb-[20px] text-center text-[24px] font-[600] leading-[32px] text-white">
                  {displayName || user?.name || 'Musfiqur Rahman'}
                </h3>
              </div>

              {/* My Wallet 部分 */}
              <div className="mb-4">
                <h3 className="mb-[12px] text-[20px] font-[700] leading-[28px] text-white">
                  My Wallet
                </h3>
                
                {/* 钱包卡片 */}
                {authenticated && walletAddress && (
                  <div className="flex h-[64px] w-[320px] items-center rounded-[16px] border-[2px] border-[#495099] bg-[#0B041E] px-4 backdrop-blur-[5px]">
                    {/* 图标 */}
                    <div className="flex size-[32px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#00FFD0] to-[#60A5FA]">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M9.78 17.49h6.04v8.65h-6.04z" fill="white"/>
                        <path d="M15.82 17.49h5.96v8.73h-5.96z" fill="#075985"/>
                        <path d="M15.78 14.91h3.6v4.96h-3.6z" fill="#075985"/>
                        <path d="M9.78 6.22h6v10.2h-6z" fill="white"/>
                        <path d="M15.78 6.22h6v10.12h-6z" fill="#075985"/>
                        <path d="M12.18 14.91h3.6v4.96h-3.6z" fill="white"/>
                      </svg>
                    </div>
                    
                    {/* 金额显示 */}
                    <div className="ml-3 flex flex-col items-center justify-center text-center text-[20px] font-[700] leading-[28px] text-white">
                      {formattedTokenBalance} USD
                    </div>
                  </div>
                )}
                
                {/* Actions Row - Faucet 和 Disconnect */}
                <div className="mt-3 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3">
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

              {/* My History 部分 */}
              <div className="flex flex-1 flex-col">
                <h3 className="mb-3 text-[20px] font-[700] leading-[28px] text-white">
                  My History
                </h3>
                <div className="flex-1 space-y-3">
                  {/* Participations 按钮 */}
                  <button
                    onClick={handleParticipations}
                    className="flex w-full items-center gap-3 rounded-[16px] border-[2px] border-[#495099] bg-[#0B041E] p-4 transition-all duration-200 hover:bg-[#495099]/10 backdrop-blur-[5px]"
                  >
                    <div className="relative flex size-8 items-center justify-center">
                      <svg
                        className="size-8"
                        viewBox="0 0 32 32"
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
                              style={{ stopColor: '#00FFD0', stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: '#60A5FA', stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        <rect
                          x="4.5"
                          y="4.5"
                          width="23"
                          height="23"
                          rx="5"
                          stroke="url(#participationsGradient)"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M10.5 16.5L14.5 20.5L21.5 11.5"
                          stroke="url(#participationsGradient)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-[18px] font-[600] text-white">
                      Participations
                    </span>
                  </button>

                  {/* Creations 按钮 */}
                  <button
                    onClick={handleCreations}
                    className="flex w-full items-center gap-3 rounded-[16px] border-[2px] border-[#495099] bg-[#0B041E] p-4 transition-all duration-200 hover:bg-[#495099]/10 backdrop-blur-[5px]"
                  >
                    <div className="flex size-8 items-center justify-center">
                      <svg
                        className="size-8"
                        viewBox="0 0 32 32"
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
                              style={{ stopColor: '#00FFD0', stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: '#60A5FA', stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M18.67 2.67H8C7.29276 2.67 6.61448 2.95119 6.11438 3.45129C5.61428 3.95138 5.33309 4.62967 5.33309 5.33691V26.6703C5.33309 27.3775 5.61428 28.0558 6.11438 28.5559C6.61448 29.056 7.29276 29.3372 8 29.3372H24C24.7072 29.3372 25.3855 29.056 25.8856 28.5559C26.3857 28.0558 26.6669 27.3775 26.6669 26.6703V10.6703L18.67 2.67Z"
                          stroke="url(#creationsGradient)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <path
                          d="M18.6669 2.66699V10.667H26.6669"
                          stroke="url(#creationsGradient)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10.6669 17.333H21.3335"
                          stroke="url(#creationsGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10.6669 22.667H21.3335"
                          stroke="url(#creationsGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-[18px] font-[600] text-white">
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
