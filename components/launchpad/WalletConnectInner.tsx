'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';

import { UserProfileModal } from '@/components/modals/UserProfileModal';

import { WalletUserInfo } from './WalletUserInfo';

interface WalletConnectInnerProps {
  onParticipationsClick?: () => void;
  onCreationsClick?: () => void;
}

/**
 * Privy 钱包连接组件
 * 支持 X (Twitter) 社交登录
 */
export function WalletConnectInner({
  onParticipationsClick,
  onCreationsClick,
}: WalletConnectInnerProps) {
  const { ready, authenticated, login } = usePrivy();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleUserClick = () => {
    if (authenticated) {
      setIsProfileModalOpen(true);
    }
  };

  const handleConnect = () => {
    login();
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {authenticated ? (
          // 已登录：显示钱包用户信息
          <WalletUserInfo onClick={handleUserClick} />
        ) : (
          // 未登录：显示连接按钮
          <div className="relative mr-3 inline-block">
            <button
              type="button"
              onClick={handleConnect}
              disabled={!ready}
              className="flex h-[40px] cursor-pointer items-center justify-center rounded-[8px] border-2 border-[#2DC3D9] bg-transparent px-6 font-medium text-[#2DC3D9] transition-all duration-200 hover:bg-[#2DC3D9]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!ready ? 'Loading...' : 'Connect'}
            </button>
          </div>
        )}
      </div>

      {/* 用户详情弹窗 */}
      {authenticated && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onParticipationsClick={onParticipationsClick}
          onCreationsClick={onCreationsClick}
        />
      )}
    </>
  );
}
