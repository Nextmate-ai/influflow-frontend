'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GradientSlider } from '../shared/GradientSlider';
import { StatCard } from '../shared/StatCard';

interface PredictionCardProps {
  id: string;
  image: string;
  title: string;
  yesPercentage: number;
  noPercentage: number;
  totalVolume: string;
  timeRemaining: string;
  onCardClick?: (prediction: PredictionCardData) => void;
}

export interface PredictionCardData {
  id: string;
  title: string;
  image: string;
  percentage: number;
  totalVolume: string;
  timeRemaining: string;
  option: string;
}

/**
 * 预言卡片组件 - 显示单个预言市场
 * 包含投票比例、统计信息和交互按钮
 */
export const PredictionCard: React.FC<PredictionCardProps> = ({
  id,
  image,
  title,
  yesPercentage,
  noPercentage,
  totalVolume,
  timeRemaining,
  onCardClick,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick({
        id,
        title,
        image,
        percentage: yesPercentage,
        totalVolume,
        timeRemaining,
        option: 'Yes',
      });
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-2 border-slate-700 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 group ${
        isHovering ? 'transform scale-105' : ''
      }`}
    >
      {/* 右上角箭头 */}
      <div className="absolute top-4 right-4 text-slate-500 group-hover:text-cyan-400 transition-colors">
        <svg
          className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>

      {/* 用户信息和头像 */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-cyan-400 transition-colors flex-shrink-0">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs font-medium mb-1">Name</p>
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
            {title}
          </h3>
        </div>
      </div>

      {/* 投票比例 */}
      <div className="mb-6">
        <GradientSlider leftPercentage={yesPercentage} rightPercentage={noPercentage} />
      </div>

      {/* 投票比例数字 */}
      <div className="flex justify-between items-center mb-6 text-sm">
        <div>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-cyan-400 rounded-lg font-semibold transition-colors text-sm">
            Yes
          </button>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-400">{yesPercentage}%</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{noPercentage}%</span>
        </div>
        <div>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-violet-400 rounded-lg font-semibold transition-colors text-sm">
            No
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="flex justify-between items-center text-xs space-x-2">
        <StatCard
          icon={<span>💰</span>}
          label="3k Vol."
          value={totalVolume}
          tooltip="Total volume traded"
        />
        <StatCard
          icon={<span>⏰</span>}
          label=""
          value={timeRemaining}
          tooltip="Time until market closes"
        />
      </div>
    </div>
  );
};
