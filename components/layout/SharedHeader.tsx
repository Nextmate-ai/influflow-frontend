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
          'relative z-10 my-[30px] flex w-full items-center justify-between bg-transparent px-4 md:px-[64px]',
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

        <div className="flex items-center gap-2 md:gap-4">
          {/* Launchpad 页面显示钱包连接按钮 */}
          {isLaunchPadPage ? (
            <WalletConnect
              onParticipationsClick={onParticipationsClick}
              onCreationsClick={onCreationsClick}
            />
          ) : (
            <>
              {isAuthenticated && user ? (
                <button
                  onClick={handleUserClick}
                  className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
                >
                  {/* 用户头像 - 优先显示 X/Twitter 头像 */}
                  <div className="relative size-10 overflow-hidden rounded-full shadow-lg shadow-[#60A5FA]/30 md:size-12">
                    {authInfo?.avatar && !avatarError ? (
                      <img
                        src={authInfo.avatar}
                        alt={authInfo.username || authInfo.name || 'User'}
                        className="size-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                        <span className="text-lg font-semibold text-white">
                          {authInfo?.username?.charAt(0).toUpperCase() || 
                           authInfo?.name?.charAt(0).toUpperCase() || 
                           user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* 用户信息 - 优先显示 X/Twitter username */}
                  <div className="hidden flex-col items-start md:flex">
                    <span className="text-sm font-medium text-white">
                      {authInfo?.username ? `@${authInfo.username}` : authInfo?.name || user.name || 'User'}
                    </span>
                    <span className="text-xs text-[#86FDE8]">
                      {user.email || ''}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  className="mr-0 h-[36px] w-[80px] rounded-[5px] bg-[#252525] text-sm text-white md:mr-3 md:h-[40px] md:w-[96px] md:text-base"
                  onClick={() => openLoginModal()}
                >
                  Login
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 用户详情弹窗 */}
      {isAuthenticated && (
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
