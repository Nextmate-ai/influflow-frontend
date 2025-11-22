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
  rawData?: Record<string, any>;
  onCardClick?: (prediction: PredictionCardData, option?: 'yes' | 'no') => void;
}

export interface PredictionCardData {
  id: string;
  title: string;
  image: string;
  percentage: number;
  yesPercentage: number;
  noPercentage: number;
  totalVolume: string;
  timeRemaining: string;
  option: string;
  // 完整的原始数据，用于详情弹窗
  rawData?: Record<string, any>;
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
  rawData,
  onCardClick,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // 从 rawData 中提取 yes_invested_ratio 和 no_invested_ratio
  const yesInvestedRatio =
    rawData?.yes_invested_ratio !== undefined
      ? parseFloat(String(rawData.yes_invested_ratio))
      : rawData?.yesInvestedRatio !== undefined
        ? parseFloat(String(rawData.yesInvestedRatio))
        : undefined;
  const noInvestedRatio =
    rawData?.no_invested_ratio !== undefined
      ? parseFloat(String(rawData.no_invested_ratio))
      : rawData?.noInvestedRatio !== undefined
        ? parseFloat(String(rawData.noInvestedRatio))
        : undefined;

  // 获取市场状态
  const getMarketStatus = () => {
    const state = rawData?.state;
    if (state === 0 || state === '0' || state === 'Active') {
      return { label: 'Active', color: 'text-green-400' };
    } else if (state === 1 || state === '1' || state === 'Resolved') {
      return { label: 'Resolved', color: 'text-blue-400' };
    } else if (state === 2 || state === '2' || state === 'Void') {
      return { label: 'Void', color: 'text-gray-400' };
    }
    return { label: 'Active', color: 'text-green-400' }; // 默认
  };

  const marketStatus = getMarketStatus();

  // 如果有 invested_ratio，使用它们来计算进度条宽度，否则使用传入的百分比
  const displayYesPercentage =
    yesInvestedRatio !== undefined
      ? yesInvestedRatio * 100
      : yesPercentage;
  const displayNoPercentage =
    noInvestedRatio !== undefined ? noInvestedRatio * 100 : noPercentage;

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick({
        id,
        title,
        image,
        percentage: yesPercentage,
        yesPercentage,
        noPercentage,
        totalVolume,
        timeRemaining,
        option: '',
        rawData, // 传递完整的原始数据
      });
    }
  };

  const handleYesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCardClick) {
      onCardClick(
        {
          id,
          title,
          image,
          percentage: yesPercentage,
          yesPercentage,
          noPercentage,
          totalVolume,
          timeRemaining,
          option: 'yes',
          rawData, // 传递完整的原始数据
        },
        'yes',
      );
    }
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCardClick) {
      onCardClick(
        {
          id,
          title,
          image,
          percentage: yesPercentage,
          yesPercentage,
          noPercentage,
          totalVolume,
          timeRemaining,
          option: 'no',
          rawData, // 传递完整的原始数据
        },
        'no',
      );
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative flex cursor-pointer flex-col rounded-2xl border border-[#60A5FA] p-4 md:p-6 pb-[16px] md:pb-[20px] pt-[24px] md:pt-[32px] transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20`}
    >
      {/* 用户信息和头像 */}
      <div className="mb-4 md:mb-[20px] flex items-start gap-3 md:gap-4">
        <div className="relative size-12 md:size-16 shrink-0 overflow-hidden rounded-full transition-colors group-hover:border-cyan-400">
          <Image
            src="/images/avatar_bg.png"
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="line-clamp-2 text-sm md:text-base leading-[24px] md:leading-[32px] text-white">
              {title}
            </h3>
            <span className={`shrink-0 text-[10px] md:text-xs font-medium ${marketStatus.color}`}>
              {marketStatus.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-start gap-3 md:gap-[20px]">
        <div className="max-w-[80px] md:max-w-[100px] truncate text-xs md:text-sm bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-transparent">
          name
        </div>

        <div className="flex-1 flex-col">
          {/* 投票比例 */}
          <div className="mb-3 md:mb-[16px] mt-[-16px] md:mt-[-20px]">
            <GradientSlider
              leftPercentage={displayYesPercentage}
              rightPercentage={displayNoPercentage}
              leftPrice={yesInvestedRatio}
              rightPrice={noInvestedRatio}
            />
          </div>

          {/* 投票比例数字 */}
          <div className="mb-4 md:mb-[24px] flex items-center justify-around gap-2 md:gap-0 text-xs md:text-sm text-white">
            <div
              onClick={handleYesClick}
              className="flex h-[36px] md:h-[40px] w-[100px] md:w-[140px] cursor-pointer items-center justify-center rounded-[12px] md:rounded-[16px] border-2 border-[#07B6D4] transition-colors hover:bg-[#07B6D4]/10"
            >
              Yes
            </div>
            <div
              onClick={handleNoClick}
              className="flex h-[36px] md:h-[40px] w-[100px] md:w-[140px] cursor-pointer items-center justify-center rounded-[12px] md:rounded-[16px] border-2 border-[#CB30E0] transition-colors hover:bg-[#CB30E0]/10"
            >
              No
            </div>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="mt-auto flex items-center justify-between space-x-2 text-xs">
        <div className="line-clamp-2 text-sm md:text-base leading-[24px] md:leading-[32px] text-white">
          <Image
            src="/images/twitter_card.png"
            alt="avatar"
            width={20}
            height={20}
            className="md:w-6 md:h-6"
          />
        </div>

        <div className="flex items-center gap-3 md:gap-[24px]">
          <StatCard
            icon={
              <Image
                src="/images/volume.png"
                alt="avatar"
                width={10}
                height={10}
                className="md:w-3 md:h-3"
              />
            }
            label=""
            value={totalVolume}
            tooltip="Total volume traded"
          />
          <StatCard
            icon={
              <Image
                src="/images/timer.png"
                alt="avatar"
                width={10}
                height={10}
                className="md:w-3 md:h-3"
              />
            }
            label=""
            value={timeRemaining}
            tooltip="Time until market closes"
          />
        </div>
      </div>
    </div>
  );
};
