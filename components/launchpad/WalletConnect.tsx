'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { WalletUserInfoSkeleton } from './skeletons/WalletUserInfoSkeleton';

// 动态导入 WalletConnectInner 组件，禁用 SSR
// 这样可以确保 QueryClientProvider 和 ConnectButton 都在客户端正确初始化
const WalletConnectInner = dynamic(
  () => import('./WalletConnectInner').then((mod) => mod.WalletConnectInner),
  {
    ssr: false,
    loading: () => <WalletUserInfoSkeleton />,
  },
);

interface WalletConnectProps {
  onParticipationsClick?: () => void;
  onCreationsClick?: () => void;
}

/**
 * 钱包连接按钮组件
 * 用于 Launchpad 页面右上角
 * 使用动态导入禁用 SSR，避免服务器端 QueryClient 错误
 * 配置账户抽象，支持免 gas 交易
 */
export function WalletConnect({
  onParticipationsClick,
  onCreationsClick,
}: WalletConnectProps) {
  const [mounted, setMounted] = useState(false);

  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端挂载前显示骨架屏
  if (!mounted) {
    return <WalletUserInfoSkeleton />;
  }

  return (
    <WalletConnectInner
      onParticipationsClick={onParticipationsClick}
      onCreationsClick={onCreationsClick}
    />
  );
}
