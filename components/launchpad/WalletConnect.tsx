'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// 动态导入 WalletConnectInner 组件，禁用 SSR
// 这样可以确保 QueryClientProvider 和 ConnectButton 都在客户端正确初始化
const WalletConnectInner = dynamic(
  () => import('./WalletConnectInner').then((mod) => mod.WalletConnectInner),
  {
    ssr: false,
    loading: () =>
      // <div className="rounded-lg bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] px-6 py-2 font-semibold text-white opacity-50">
      //   加载中...
      // </div>
      null,
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

  // 在客户端挂载前不渲染
  if (!mounted) {
    return null;
    // <div className="rounded-lg bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] px-6 py-2 font-semibold text-white opacity-50">
    //   加载中...
    // </div>
  }

  return (
    <WalletConnectInner
      onParticipationsClick={onParticipationsClick}
      onCreationsClick={onCreationsClick}
    />
  );
}
