'use client';

import { MarketCardSkeleton } from './MarketCardSkeleton';

interface DashboardContentSkeletonProps {
  /** 显示的卡片数量，默认 9 */
  count?: number;
}

/**
 * 仪表盘内容骨架屏组件
 * 在市场列表加载时显示
 * 使用与 AuctionGrid 相同的网格布局
 */
export function DashboardContentSkeleton({
  count = 9,
}: DashboardContentSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-[24px]">
      {Array.from({ length: count }).map((_, index) => (
        <MarketCardSkeleton key={index} />
      ))}
    </div>
  );
}
