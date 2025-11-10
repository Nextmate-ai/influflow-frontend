'use client';

import { DashboardContent } from '@/components/launchpad/dashboard/DashboardContent';
import { SharedHeader } from '@/components/layout/SharedHeader';

/**
 * 发射台仪表盘主页
 * 显示热门预言市场和拍卖列表
 */
export default function LaunchPadDashboard() {
  return (
    <div className="min-h-screen bg-[#0B041E] text-white pb-[32px]">
      <SharedHeader className="my-[0] py-[30px]" />
      <DashboardContent />
    </div>
  );
}
