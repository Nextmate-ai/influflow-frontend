'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { SharedHeader } from '@/components/layout/SharedHeader';
import { LaunchPadHeader } from '@/components/launchpad/LaunchPadHeader';

// 动态导入 ParticipationsTable，禁用 SSR 以避免 useActiveWallet 在服务器端调用
const ParticipationsTable = dynamic(
  () => import('@/components/launchpad/participations/ParticipationsTable').then((mod) => mod.ParticipationsTable),
  {
    ssr: false,
    loading: () => (
      <div className="bg-[#0B041E] border border-[#2DC3D9] rounded-2xl overflow-hidden flex flex-col h-[600px] items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    ),
  },
);

/**
 * 参与历史页面
 * 显示用户的所有参与和创建历史
 */
export default function ParticipationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SharedHeader />
      <LaunchPadHeader showCreate={false} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ParticipationsTable />
      </div>
    </div>
  );
}
