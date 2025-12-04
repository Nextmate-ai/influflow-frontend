'use client';

import Image from 'next/image';

/**
 * 移动端阻断页面组件
 * 提示用户在桌面端访问 nextmate.fun
 */
export function MobileBlocker() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0B041E] px-6 text-white">
      {/* Logo */}
      <div className="mb-16">
        <Image
          src="/images/logo_white.png"
          alt="nextmate.fun"
          width={240}
          height={45}
          className="h-auto w-[240px]"
          priority
        />
      </div>

      {/* 主要内容 */}
      <div className="flex flex-col items-center">
        {/* 主标题 */}
        <h1 className="mb-6 max-w-[320px] text-center text-[28px] font-bold leading-[1.3] tracking-tight">
          We&apos;re working on the mobile version.
        </h1>

        {/* 副标题 */}
        <p className="max-w-[280px] text-center text-[16px] leading-relaxed text-gray-400">
          Please visit{' '}
          <span className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] bg-clip-text font-medium text-transparent">
            nextmate.fun
          </span>{' '}
          on desktop.
        </p>
      </div>
    </div>
  );
}
