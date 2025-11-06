'use client';

import React from 'react';
import { LaunchPadHeader } from '@/components/launchpad/LaunchPadHeader';
import { DashboardContent } from '@/components/launchpad/dashboard/DashboardContent';

/**
 * 发射台仪表盘主页
 * 显示热门预言市场和拍卖列表
 */
export default function LaunchPadDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <LaunchPadHeader showCreate={true} />
      <DashboardContent />
    </div>
  );
}
