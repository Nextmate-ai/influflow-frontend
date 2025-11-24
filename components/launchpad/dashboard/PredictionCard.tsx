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
  creatorInfo?: {
    address: string;
    xUsername?: string;
    xName?: string;
    xAvatarUrl?: string;
  };
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
  // 创建者信息（包含 X/Twitter 信息）
  creatorInfo?: {
    address: string;
    xUsername?: string;
    xName?: string;
    xAvatarUrl?: string;
  };
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
  creatorInfo,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // 获取显示的头像和名称
  const displayAvatar =
    avatarError || !creatorInfo?.xAvatarUrl
      ? '/images/avatar_bg.png'
      : creatorInfo.xAvatarUrl;
  const displayName =
    creatorInfo?.xName ||
    creatorInfo?.xUsername ||
    (creatorInfo?.address
      ? `${creatorInfo.address.slice(0, 6)}...${creatorInfo.address.slice(-4)}`
      : 'Unknown');

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

  // 将 outcome 转换为显示文本
  const getOutcomeText = (outcome: any): string | null => {
    if (outcome === undefined || outcome === null) {
      return null;
    }
    // 支持数字和字符串格式
    if (outcome === 0 || outcome === '0' || outcome === 'No') {
      return 'No';
    } else if (outcome === 1 || outcome === '1' || outcome === 'Yes') {
      return 'Yes';
    }
    return null;
  };

  // 获取市场状态
  const getMarketStatus = () => {
    const state = rawData?.state;
    if (state === 0 || state === '0' || state === 'Active') {
      return { label: 'Active', color: 'text-green-400', isActive: true };
    } else if (state === 1 || state === '1' || state === 'Resolved') {
      // 对于 Resolved 状态，尝试获取 outcome 结果
      const outcomeText = getOutcomeText(rawData?.outcome);
      if (outcomeText) {
        const label = `Resolved: ${outcomeText}`;
        return { label, color: 'text-blue-400', isActive: false };
      }
      return { label: 'Resolved', color: 'text-blue-400', isActive: false };
    } else if (state === 2 || state === '2' || state === 'Void') {
      return { label: 'Void', color: 'text-gray-400', isActive: false };
    }
    return { label: 'Active', color: 'text-green-400', isActive: true }; // 默认
  };

  const marketStatus = getMarketStatus();
  const isMarketActive = marketStatus.isActive;

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
        creatorInfo, // 传递创建者信息
      });
    }
  };

  const handleYesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 如果市场不是活跃状态，不允许下注
    if (!isMarketActive) {
      return;
    }
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
          creatorInfo, // 传递创建者信息
        },
        'yes',
      );
    }
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 如果市场不是活跃状态，不允许下注
    if (!isMarketActive) {
      return;
    }
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
          creatorInfo, // 传递创建者信息
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
      className={`group relative flex cursor-pointer flex-col rounded-[23px] border border-[#60A5FA] p-4 pb-[16px] pt-[24px] transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 md:px-6 md:pb-6 md:pt-8`}
    >
      {/* 主布局：左边是头像+用户名，右边是标题+进度条+按钮 */}
      <div className="mb-4 flex items-start gap-2 md:mb-6 md:gap-4">
        {/* 左侧：头像和用户名 */}
        <div className="flex shrink-0 flex-col items-center gap-1.5 md:gap-2">
          {/* 头像 */}
          <div className="relative size-10 overflow-hidden rounded-full transition-colors group-hover:border-cyan-400 md:size-[64px]">
            {creatorInfo?.xAvatarUrl && !avatarError ? (
              <img
                src={creatorInfo.xAvatarUrl}
                alt={displayName}
                className="size-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <Image
                src={displayAvatar}
                alt={displayName}
                fill
                className="object-cover"
              />
            )}
          </div>
          {/* 用户名 */}
          <div className="w-full max-w-[64px] truncate bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-center text-[10px] text-transparent md:max-w-[80px] md:text-[14px] md:leading-[20px]">
            {displayName}
          </div>
        </div>

        {/* 右侧：标题、进度条和按钮 */}
        <div className="min-w-0 flex-1">
          {/* 标题 */}
          <div className="mb-3 flex items-center gap-2 md:mb-6">
            <h3 className="line-clamp-2 min-h-[40px] text-xs leading-[20px] text-white md:min-h-[48px] md:text-lg md:leading-6">
              {title}
            </h3>
            {!marketStatus.isActive && (
              <span className={`shrink-0 text-[10px] font-medium md:text-xs ${marketStatus.color}`}>
                {marketStatus.label}
              </span>
            )}
          </div>

          {/* 投票比例 */}
          <div className="mb-2 md:mb-[12px]">
            <GradientSlider
              leftPercentage={displayYesPercentage}
              rightPercentage={displayNoPercentage}
              leftPrice={yesInvestedRatio}
              rightPrice={noInvestedRatio}
            />
          </div>

          {/* Yes/No 按钮 */}
          <div className="mb-4 flex items-center justify-around gap-2 text-xs text-white md:mb-0 md:gap-16 md:text-[17px] md:font-bold md:leading-[25px]">
            <div
              onClick={handleYesClick}
              className={`flex h-[36px] w-[100px] items-center justify-center rounded-[12px] border-2 border-[#07B6D4] transition-colors md:h-10 md:w-[140px] md:rounded-[12px] ${
                isMarketActive
                  ? 'cursor-pointer hover:bg-[#07B6D4]/10'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              Yes
            </div>
            <div
              onClick={handleNoClick}
              className={`flex h-[36px] w-[100px] items-center justify-center rounded-[12px] border-2 border-[#CB30E0] transition-colors md:h-10 md:w-[140px] md:rounded-[12px] ${
                isMarketActive
                  ? 'cursor-pointer hover:bg-[#CB30E0]/10'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              No
            </div>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="mt-auto flex items-center justify-between space-x-2 text-xs">
        <div className="line-clamp-2 text-sm leading-[24px] text-white md:text-base md:leading-[32px]">
          <Image
            src="/images/twitter_card.png"
            alt="avatar"
            width={16}
            height={16}
            className="md:size-4"
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
                className="md:size-3"
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
                className="md:size-3"
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
