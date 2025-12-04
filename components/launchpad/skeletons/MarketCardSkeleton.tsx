'use client';

/**
 * 预测市场卡片骨架屏组件
 * 在市场数据加载时显示
 * 布局和尺寸与 PredictionCard 组件完全一致
 */
export function MarketCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-[#60A5FA] p-4 pb-[16px] pt-[24px] md:p-6 md:pb-[16px] md:pt-[24px]">
      {/* 用户信息和头像骨架 */}
      <div className="mb-4 flex items-start gap-3 md:mb-[20px] md:gap-4">
        {/* 圆形头像：size-12 md:size-16 */}
        <div className="size-12 shrink-0 animate-pulse rounded-full bg-gray-700 md:size-16" />

        {/* 标题区域：2行 */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-6 w-full animate-pulse rounded bg-gray-700" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-700" />
        </div>
      </div>

      <div className="flex items-start gap-3 md:gap-[20px]">
        {/* 创建者名称占位符 */}
        <div className="h-4 w-20 animate-pulse rounded bg-gray-700" />

        <div className="flex-1 flex-col">
          {/* 进度条骨架 */}
          <div className="mb-3 h-2 w-full animate-pulse rounded-full bg-gray-700 md:mb-[16px]" />

          {/* Yes/No 按钮骨架 */}
          <div className="mb-4 flex items-center justify-around gap-2 md:mb-[24px] md:gap-0">
            <div className="h-[36px] w-[100px] animate-pulse rounded-[12px] border-2 border-gray-700 bg-gray-800/50 md:h-[32px] md:w-[108px] md:rounded-[10px]" />
            <div className="h-[36px] w-[100px] animate-pulse rounded-[12px] border-2 border-gray-700 bg-gray-800/50 md:h-[32px] md:w-[108px] md:rounded-[10px]" />
          </div>
        </div>
      </div>

      {/* 统计信息骨架 */}
      <div className="mt-auto flex items-center justify-between">
        {/* 分享图标占位符 */}
        <div className="size-5 animate-pulse rounded bg-gray-700 md:size-6" />

        {/* Volume 和时间占位符 */}
        <div className="flex items-center gap-3 md:gap-[24px]">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-700" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
