'use client';

import Image from 'next/image';
import { useActiveWallet } from 'thirdweb/react';

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
  const wallet = useActiveWallet();
  const { authInfo, isLoading: isLoadingAuth } = useWalletAuth();

  // 如果钱包未连接，不显示
  if (!wallet) {
    return null;
  }

  const address = wallet.getAccount()?.address || '';
  const formattedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  // 获取显示名称：优先使用 X 昵称，否则使用地址
  const displayName = authInfo?.name || authInfo?.username || formattedAddress;

  // 获取头像：优先使用 X 头像，否则使用基于地址生成的头像
  const hasAvatar = !!authInfo?.avatar;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
    >
      {/* 用户头像 - 与 SharedHeader 样式完全一致 */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#60A5FA]">
        {hasAvatar && authInfo.avatar ? (
          <Image
            src={authInfo.avatar}
            alt={displayName}
            fill
            className="object-cover"
            onError={(e) => {
              // 如果头像加载失败，隐藏图片，显示默认头像
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        {!hasAvatar && (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              {address ? address.slice(2, 4).toUpperCase() : 'W'}
            </span>
          </div>
        )}
      </div>
      {/* 用户信息 - 与 SharedHeader 样式完全一致 */}
      <div className="flex flex-col items-start">
        <span className="text-white text-sm font-medium">
          {isLoadingAuth ? '...' : displayName}
        </span>
        <span className="text-[#86FDE8] text-xs">{formattedAddress}</span>
      </div>
    </button>
  );
}
