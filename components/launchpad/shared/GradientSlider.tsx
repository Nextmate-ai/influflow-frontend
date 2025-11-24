'use client';

import Image from 'next/image';
import React from 'react';

interface GradientSliderProps {
  leftPercentage: number;
  rightPercentage: number;
  leftPrice?: number; // yes_price (0-1之间的小数)
  rightPrice?: number; // no_price (0-1之间的小数)
  onChange?: (left: number, right: number) => void;
  disabled?: boolean;
}

/**
 * 渐变滑块组件 - 用于预言市场的投票比例展示
 */
export const GradientSlider: React.FC<GradientSliderProps> = ({
  leftPercentage,
  rightPercentage,
  leftPrice,
  rightPrice,
  onChange,
  disabled = true,
}) => {
  const handleDragStart = (
    direction: 'left' | 'right',
    e: React.MouseEvent,
  ) => {
    if (disabled || !onChange) return;

    const startX = e.clientX;
    const container = e.currentTarget.parentElement as HTMLElement;
    const rect = container.getBoundingClientRect();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const containerWidth = rect.width;
      const percentChange = (deltaX / containerWidth) * 100;

      if (direction === 'left') {
        const newLeft = Math.min(
          Math.max(0, leftPercentage + percentChange),
          100 - rightPercentage,
        );
        onChange(newLeft, rightPercentage);
      } else {
        const newRight = Math.min(
          Math.max(0, rightPercentage - percentChange),
          100 - leftPercentage,
        );
        onChange(leftPercentage, newRight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="w-full">
      {/* 价格标签 - 在进度条上方 */}
      <div className="relative mb-2 h-6">
        {/* 左边数字 - 在左边进度条中心 */}
        <div
          className="absolute -translate-x-1/2"
          style={{
            left: `${leftPercentage / 2}%`,
          }}
        >
          <span className="text-lg font-semibold text-[#00B2FF]">
            {leftPrice !== undefined
              ? `${(leftPrice * 100).toFixed(1)}%`
              : `${Math.round(leftPercentage)}%`}
          </span>
        </div>
        {/* 右边数字 - 在右边进度条中心 */}
        <div
          className="absolute -translate-x-1/2"
          style={{
            left: `${100 - rightPercentage / 2}%`,
          }}
        >
          <span className="text-lg font-semibold text-[#FF2DDF]">
            {rightPrice !== undefined
              ? `${(rightPrice * 100).toFixed(1)}%`
              : `${Math.round(rightPercentage)}%`}
          </span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="relative h-2 overflow-visible rounded-full bg-slate-700">
        {/* 左边渐变条 */}
        <div
          className="absolute left-0 top-0 h-full rounded-l-full bg-gradient-to-r from-[#00B2FF] to-[#00FFD0]"
          style={{
            width: `${leftPercentage}%`,
            zIndex: 1,
          }}
        />
        {/* 右边渐变条 */}
        <div
          className="absolute right-0 top-0 h-full rounded-r-full bg-gradient-to-l from-[#870CD8] to-[#FF2DDF]"
          style={{
            width: `${rightPercentage}%`,
            zIndex: 1,
          }}
        />

        {/* 分割线和交界处图标 */}
        <div
          className="absolute top-0 h-full w-1 bg-white shadow-lg"
          style={{
            left: `${leftPercentage}%`,
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        />
        {/* 交界处图标 - 在进度条上 */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${leftPercentage}%`,
            top: '50%',
            zIndex: 3,
          }}
        >
          <Image
            src="/images/lightning.png"
            alt="divider"
            width={16}
            height={24}
            className="h-6 w-auto"
          />
        </div>
      </div>
    </div>
  );
};
