import { ReactNode } from 'react';
import { Metadata, Viewport } from 'next';

import { MobileBlocker } from '@/components/launchpad/MobileBlocker';

// Viewport 配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// SEO 元数据
export const metadata: Metadata = {
  title: 'nextmate.fun',
  description: 'A platform where creators turn opinions into prediction markets and earn from fan participation.',
};

/**
 * Launchpad 专属 Layout
 * 移动端显示阻断页面,桌面端正常渲染
 */
export default function LaunchpadLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* 移动端 (< 768px): 显示阻断页面 */}
      <div className="md:hidden">
        <MobileBlocker />
      </div>

      {/* 桌面端 (>= 768px): 正常渲染 */}
      <div className="hidden md:block">{children}</div>
    </>
  );
}
