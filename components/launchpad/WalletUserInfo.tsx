'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import React from 'react';

import { useWalletAuth } from '@/hooks/useWalletAuth';

interface WalletUserInfoProps {
  onClick?: () => void;
}

/**
 * 钱包用户信息展示组件
 * 显示 X 用户昵称和钱包地址
 * 样式与 SharedHeader 中的用户信息展示完全一致
 */
export function WalletUserInfo({ onClick }: WalletUserInfoProps) {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { authInfo, isLoading: isLoadingAuth } = useWalletAuth();
  const [imageError, setImageError] = React.useState(false);

  // 如果未认证,不显示
  if (!authenticated) {
    return null;
  }

  // 获取第一个钱包地址
  const address = wallets[0]?.address || '';
  const formattedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  // 获取头像：优先使用 X 头像，否则使用基于地址生成的头像
  const hasAvatar = !!authInfo?.avatar && !imageError;

  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
    >
      {/* 用户头像 - 与 SharedHeader 样式完全一致 */}
      <div className="relative size-12 overflow-hidden rounded-full shadow-lg shadow-[#60A5FA]/30">
        {hasAvatar && authInfo.avatar ? (
          <img
            src={authInfo.avatar}
            alt={authInfo.username || authInfo.name || 'User'}
            className="size-full object-cover"
            onError={() => {
              // 如果头像加载失败，切换到默认头像
              setImageError(true);
            }}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
            <span className="text-lg font-semibold text-white">
              {authInfo?.username?.charAt(0).toUpperCase() ||
               authInfo?.name?.charAt(0).toUpperCase() ||
               (address ? address.slice(2, 4).toUpperCase() : 'W')}
            </span>
          </div>
        )}
      </div>
      {/* 用户信息 - 优先显示 X/Twitter username */}
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium text-white">
          {isLoadingAuth ? '...' :
           authInfo?.username ? `@${authInfo.username}` :
           authInfo?.name || formattedAddress}
        </span>
        <span className="text-xs text-[#86FDE8]">{formattedAddress}</span>
      </div>
      {/* 三个点图标 */}
      <div className="ml-2 flex flex-col gap-1">
        <div className="size-1 rounded-full bg-[#6B55F1]"></div>
        <div className="size-1 rounded-full bg-[#6B55F1]"></div>
        <div className="size-1 rounded-full bg-[#6B55F1]"></div>
      </div>
    </button>
  );
}
