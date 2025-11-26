'use client';

import { cn } from '@heroui/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { WalletConnect } from '@/components/launchpad/WalletConnect';
import { UserProfileModal } from '@/components/modals/UserProfileModal';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useAuthStore } from '@/stores/authStore';

interface SharedHeaderProps {
  className?: string;
  onProfileModalOpenChange?: (isOpen: boolean) => void;
  onParticipationsClick?: () => void;
  onCreationsClick?: () => void;
}

/**
 * 共享的 Header 组件
 * 用于首页 (/) 和 launchpad (/launchpad) 页面
 */
export const SharedHeader = ({
  className,
  onProfileModalOpenChange,
  onParticipationsClick,
  onCreationsClick,
}: SharedHeaderProps) => {
  const { isAuthenticated, openLoginModal, logout, user, setSession } =
    useAuthStore();
  const { authInfo } = useWalletAuth(); // 获取 Privy 的 X/Twitter 用户信息
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const pathname = usePathname();

  // 判断是否是 launchpad 页面
  const isLaunchPadPage = pathname?.startsWith('/launchpad');

  const handleModalOpenChange = (isOpen: boolean) => {
    setIsProfileModalOpen(isOpen);
    onProfileModalOpenChange?.(isOpen);
  };

  // 测试环境：假设已登录，设置默认用户数据
  useEffect(() => {
    if (!isAuthenticated && !user) {
      // 测试环境：自动设置登录状态
      setSession(
        {
          id: 'test-user-1',
          name: 'Musfiqur Rahman',
          email: 'ryzenpixel@gmail.com',
          avatar: '/images/avatar_bg.png',
        },
        'test-token',
        Date.now() + 24 * 60 * 60 * 1000,
      );
    }
  }, [isAuthenticated, user, setSession]);

  // 当 authInfo 变化时重置头像错误状态
  useEffect(() => {
    setAvatarError(false);
  }, [authInfo?.avatar]);

  const handleUserClick = () => {
    if (isAuthenticated) {
      handleModalOpenChange(true);
    } else {
      openLoginModal();
    }
  };

  return (
    <>
      <div
        className={cn(
          'relative z-10 my-[30px] flex w-full items-center justify-between bg-transparent px-4 md:px-[40px]',
          className,
        )}
      >
        <Image
          className="ml-0 h-[20px] w-auto md:ml-3 md:h-[24px]"
          src="/images/logo_white.png"
          width={159}
          height={30}
          alt="Influxy Logo"
        />

        {/* 只在 Launchpad 页面显示钱包连接按钮 */}
        {isLaunchPadPage && (
          <div className="flex items-center gap-2 md:gap-4">
            <WalletConnect
              onParticipationsClick={onParticipationsClick}
              onCreationsClick={onCreationsClick}
            />
          </div>
        )}
      </div>

      {/* 用户详情弹窗 - 只在 Launchpad 页面显示 */}
      {isAuthenticated && isLaunchPadPage && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => handleModalOpenChange(false)}
          onParticipationsClick={onParticipationsClick}
          onCreationsClick={onCreationsClick}
        />
      )}
    </>
  );
};
