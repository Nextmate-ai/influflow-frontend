'use client';

import React from 'react';
import { LaunchPadHeader } from '@/components/launchpad/LaunchPadHeader';
import { ParticipationsTable } from '@/components/launchpad/participations/ParticipationsTable';

/**
 * 参与历史页面
 * 显示用户的所有参与和创建历史
 */
export default function ParticipationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <LaunchPadHeader showCreate={false} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ParticipationsTable />
      </div>
    </div>
  );
}
