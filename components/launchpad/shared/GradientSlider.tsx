'use client';

import React from 'react';

interface GradientSliderProps {
  leftPercentage: number;
  rightPercentage: number;
  onChange?: (left: number, right: number) => void;
  disabled?: boolean;
}

/**
 * 渐变滑块组件 - 用于预言市场的投票比例展示
 */
export const GradientSlider: React.FC<GradientSliderProps> = ({
  leftPercentage,
  rightPercentage,
  onChange,
  disabled = true,
}) => {
  const handleDragStart = (direction: 'left' | 'right', e: React.MouseEvent) => {
    if (disabled || !onChange) return;

    const startX = e.clientX;
    const container = e.currentTarget.parentElement as HTMLElement;
    const rect = container.getBoundingClientRect();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const containerWidth = rect.width;
      const percentChange = (deltaX / containerWidth) * 100;

      if (direction === 'left') {
        const newLeft = Math.min(Math.max(0, leftPercentage + percentChange), 100 - rightPercentage);
        onChange(newLeft, rightPercentage);
      } else {
        const newRight = Math.min(Math.max(0, rightPercentage - percentChange), 100 - leftPercentage);
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
      <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
        {/* 背景渐变条 */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-magenta-500"
          style={{
            width: `${leftPercentage}%`,
            zIndex: 1,
          }}
        />
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-violet-500 to-cyan-500"
          style={{
            width: `${rightPercentage}%`,
            zIndex: 1,
          }}
        />

        {/* 分割线 */}
        <div
          className="absolute top-0 h-full w-1 bg-white shadow-lg"
          style={{
            left: `${leftPercentage}%`,
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        />
      </div>

      {/* 百分比标签 */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold text-lg">{Math.round(leftPercentage)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-violet-400 font-semibold text-lg">{Math.round(rightPercentage)}%</span>
        </div>
      </div>
    </div>
  );
};
