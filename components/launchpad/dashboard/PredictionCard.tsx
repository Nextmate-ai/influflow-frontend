'use client';

import Image from 'next/image';
import React, { useState } from 'react';
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
      className={`relative h-[300px] flex flex-col border border-[#60A5FA] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 group`}
    >
      {/* 用户信息和头像 */}
      <div className="flex items-start gap-4 mb-[20px]">
        <div className="relative w-16 h-16 rounded-full overflow-hidden group-hover:border-cyan-400 transition-colors flex-shrink-0">
          <Image
            src="/images/avatar_bg.png"
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-base leading-[32px] line-clamp-2">
            {title}
          </h3>
        </div>
      </div>

      {/* 投票比例 */}
      <div className="mb-6">
        <GradientSlider
          leftPercentage={yesPercentage}
          rightPercentage={noPercentage}
        />
      </div>

      {/* 投票比例数字 */}
      <div className="flex justify-around items-center mb-[24px] text-sm text-white">
        <div className="w-[160px] h-[44px] flex items-center justify-center border-2 border-[#07B6D4] rounded-[16px]">
          Yes
        </div>
        <div className="w-[160px] h-[44px] flex items-center justify-center border-2 border-[#CB30E0] rounded-[16px]">
          No
        </div>
      </div>

      {/* 统计信息 */}
      <div className="flex justify-between items-center text-xs space-x-2 mt-auto">
        <div className="text-white text-base leading-[32px] line-clamp-2">
          @name
        </div>

        <div className="flex items-center gap-2">
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
    </div>
  );
};
