'use client';

import { cn } from '@heroui/react';
import Image from 'next/image';

import { useAuthStore } from '@/stores/authStore';

interface SharedHeaderProps {
  className?: string;
}

/**
 * 共享的 Header 组件
 * 用于首页 (/) 和 launchpad (/launchpad) 页面
 */
export const SharedHeader = ({ className }: SharedHeaderProps) => {
  const { isAuthenticated, openLoginModal, logout } = useAuthStore();

  return (
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

      <div className="flex justify-center text-white">
        <button
          className="mr-3 h-[40px] w-[96px] rounded-[5px] bg-[#252525] text-white"
          onClick={() => {
            if (isAuthenticated) {
              logout();
            } else {
              openLoginModal();
            }
          }}
        >
          {isAuthenticated ? 'Log Out' : 'Login'}
        </button>
      </div>
    </div>
  );
};
