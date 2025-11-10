'use client';

import { Topbar } from '@/components/layout/Topbar';
import { useAuthStore } from '@/stores/authStore';
import { usePathname } from 'next/navigation';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  // 不在首页显示 Topbar
  const isHomePage = pathname === '/';
  // launchpad 页面作为独立模块，不使用 Topbar
  const isLaunchPadPage = pathname?.startsWith('/launchpad');

  return (
    <>
      {!isAuthenticated && !isHomePage && !isLaunchPadPage && <Topbar />}
      {children}
    </>
  );
}
