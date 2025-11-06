'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LaunchPadHeaderProps {
  showCreate?: boolean;
}

/**
 * 发射台 Header 组件 - 在 Dashboard 和 Participations 页面间共享
 * 提供导航和创建按钮
 */
export const LaunchPadHeader: React.FC<LaunchPadHeaderProps> = ({ showCreate = true }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header Top Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Turn your opinions into earnings.
            </h1>
            <p className="text-slate-400">Create and participate in prediction markets</p>
          </div>

          {showCreate && (
            <Link
              href="/launchpad/create"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create
            </Link>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8">
          <Link
            href="/launchpad"
            className={`pb-3 font-medium transition-all duration-200 relative ${
              isActive('/launchpad') && !isActive('/launchpad/participations')
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Popular Live Auction
          </Link>

          <Link
            href="/launchpad/participations"
            className={`pb-3 font-medium transition-all duration-200 relative ${
              isActive('/launchpad/participations')
                ? 'text-cyan-400 border-b-2 border-cyan-400'
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
