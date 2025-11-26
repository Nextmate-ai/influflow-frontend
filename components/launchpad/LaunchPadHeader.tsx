'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { WalletConnect } from './WalletConnect';

interface LaunchPadHeaderProps {
  showCreate?: boolean;
}

/**
 * 发射台 Header 组件 - 在 Dashboard 和 Participations 页面间共享
 * 提供导航和创建按钮
 */
export const LaunchPadHeader: React.FC<LaunchPadHeaderProps> = ({
  showCreate = true,
}) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href);
  };

  return (
    <div className="w-full border-b border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header Top Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">
              Turn your opinions into earnings.
            </h1>
            <p className="text-slate-400">
              Create and participate in prediction markets
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* 钱包连接按钮 - 右上角 */}
            <WalletConnect />

            {showCreate && (
              <Link
                href="/launchpad/create"
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-cyan-400 hover:to-blue-400 hover:shadow-xl"
              >
                Create
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8">
          <Link
            href="/launchpad"
            className={`relative pb-3 font-medium transition-all duration-200 ${
              isActive('/launchpad') && !isActive('/launchpad/participations')
                ? 'border-b-2 border-cyan-400 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Popular Live Auction
          </Link>

          <Link
            href="/launchpad/participations"
            className={`relative pb-3 font-medium transition-all duration-200 ${
              isActive('/launchpad/participations')
                ? 'border-b-2 border-cyan-400 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Participations
          </Link>
        </div>
      </div>
    </div>
  );
};
