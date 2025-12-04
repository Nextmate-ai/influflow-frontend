'use client';

/**
 * 钱包用户信息骨架屏组件
 * 在用户认证信息加载时显示
 * 布局和尺寸与 WalletUserInfo 组件完全一致
 */
export function WalletUserInfoSkeleton() {
  return (
    <div className="flex items-center gap-3">
      {/* 头像骨架：圆形，size-12 (48px) */}
      <div className="relative size-12 animate-pulse overflow-hidden rounded-full bg-gray-700 shadow-lg shadow-[#60A5FA]/30" />

      {/* 用户信息骨架 */}
      <div className="flex flex-col items-start gap-2">
        {/* 用户名占位符：宽度约 120px，高度 14px (text-sm) */}
        <div className="h-[14px] w-32 animate-pulse rounded bg-gray-700" />
        {/* 钱包地址占位符：宽度约 100px，高度 12px (text-xs) */}
        <div className="h-3 w-24 animate-pulse rounded bg-gray-700" />
      </div>

      {/* 三个点图标骨架 */}
      <div className="ml-2 flex flex-col gap-1">
        <div className="size-1 animate-pulse rounded-full bg-gray-700" />
        <div className="size-1 animate-pulse rounded-full bg-gray-700" />
        <div className="size-1 animate-pulse rounded-full bg-gray-700" />
      </div>
    </div>
  );
}
