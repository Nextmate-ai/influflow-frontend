'use client';

import { cn } from '@heroui/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/stores/authStore';
import { UserProfileModal } from '@/components/modals/UserProfileModal';
import { WalletConnect } from '@/components/launchpad/WalletConnect';

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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
          'relative z-10 my-[30px] flex w-full items-center justify-between bg-transparent px-[64px]',
          className,
        )}
      >
        <Image
          className="ml-3 h-[24px] w-auto"
          src="/images/logo_white.png"
          width={159}
          height={30}
          alt="Influxy Logo"
        />

        <div className="flex items-center gap-4">
          {/* Launchpad 页面显示钱包连接按钮 */}
          {isLaunchPadPage ? (
            <WalletConnect />
          ) : (
            <>
              {isAuthenticated && user ? (
                <button
                  onClick={handleUserClick}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {/* 用户头像 */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#60A5FA]">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* 用户信息 */}
                  <div className="flex flex-col items-start">
                    <span className="text-white text-sm font-medium">
                      {user.name || 'User'}
                    </span>
                    <span className="text-[#86FDE8] text-xs">
                      {user.email || ''}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  className="mr-3 h-[40px] w-[96px] rounded-[5px] bg-[#252525] text-white"
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
