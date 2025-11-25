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
  filterStatus?: 'live' | 'finished';
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
  filterStatus,
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
    const stateStr = String(state || '').toLowerCase();
    
    // 如果是 live 视图，不显示 active 状态
    if (filterStatus === 'live') {
      return { label: null, color: '', isActive: true };
    }
    
    // finished 视图：显示 finished 或 void
    if (state === 1 || state === '1' || stateStr === 'resolved') {
      // 对于 Resolved 状态，尝试获取 outcome 结果
      const outcomeText = getOutcomeText(rawData?.outcome);
      if (outcomeText) {
        const label = `Finished: ${outcomeText}`;
        return { label, color: 'text-blue-400', isActive: false };
      }
      return { label: 'Finished', color: 'text-blue-400', isActive: false };
    } else if (state === 2 || state === '2' || stateStr === 'void' || stateStr === 'voided') {
      return { label: 'Void', color: 'text-gray-400', isActive: false };
    }
    
    // 默认情况（不应该出现在 finished 视图中）
    return { label: null, color: '', isActive: false };
  };

  const marketStatus = getMarketStatus();
  const isMarketActive = marketStatus.isActive;

  // 如果有 invested_ratio，使用它们来计算进度条宽度，否则使用传入的百分比
  const displayYesPercentage =
    yesInvestedRatio !== undefined ? yesInvestedRatio * 100 : yesPercentage;
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
      className={`group relative flex cursor-pointer flex-col rounded-2xl border border-[#60A5FA] p-4 pb-[16px] pt-[24px] transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20 md:p-6 md:pb-[16px] md:pt-[24px]`}
    >
      {/* 用户信息和头像 */}
      <div className="mb-4 flex items-start gap-3 md:mb-[20px] md:gap-4">
        {creatorInfo?.xUsername ? (
          <a
            href={`https://x.com/${creatorInfo.xUsername.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative size-12 shrink-0 overflow-hidden rounded-full transition-colors group-hover:border-cyan-400 md:size-16 cursor-pointer hover:opacity-80"
          >
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
          </a>
        ) : (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full transition-colors group-hover:border-cyan-400 md:size-16">
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
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="line-clamp-2 text-[18px] leading-[24px] text-white md:leading-[32px]">
              {title}
            </h3>
            {marketStatus.label && (
              <span
                className={`shrink-0 text-[10px] font-medium md:text-xs ${marketStatus.color}`}
              >
                {marketStatus.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-start justify-start gap-3 md:gap-[20px]">
        {creatorInfo?.xUsername ? (
          <a
            href={`https://x.com/${creatorInfo.xUsername.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[80px] truncate bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-xs text-transparent transition-opacity hover:opacity-80 md:max-w-[100px] md:text-sm cursor-pointer"
          >
            {displayName}
          </a>
        ) : (
          <div className="max-w-[80px] truncate bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-xs text-transparent md:max-w-[100px] md:text-sm">
            {displayName}
          </div>
        )}

        <div className="flex-1 flex-col">
          {/* 投票比例 */}
          <div className="mb-3 mt-[-16px] md:mb-[16px] md:mt-[-20px]">
            <GradientSlider
              leftPercentage={displayYesPercentage}
              rightPercentage={displayNoPercentage}
              leftPrice={yesInvestedRatio}
              rightPrice={noInvestedRatio}
            />
          </div>

          {/* 投票比例数字 */}
          <div className="mb-4 flex items-center justify-around gap-2 text-xs text-white md:mb-[24px] md:gap-0 md:text-sm">
            <div
              onClick={handleYesClick}
              className={`flex h-[36px] w-[100px] items-center justify-center rounded-[12px] border-2 border-[#07B6D4] transition-colors md:h-[32px] md:w-[108px] md:rounded-[10px] ${
                isMarketActive
                  ? 'cursor-pointer hover:bg-[#07B6D4]/10'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              Yes
            </div>
            <div
              onClick={handleNoClick}
              className={`flex h-[36px] w-[100px] items-center justify-center rounded-[12px] border-2 border-[#CB30E0] transition-colors md:h-[32px] md:w-[108px] md:rounded-[10px] ${
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
          {creatorInfo?.xUsername ? (
            <a
              href={`https://x.com/${creatorInfo.xUsername.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-block transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/twitter_card.png"
                alt="Twitter"
                width={20}
                height={20}
                className="md:size-6 cursor-pointer"
              />
            </a>
          ) : (
            <Image
              src="/images/twitter_card.png"
              alt="Twitter"
              width={20}
              height={20}
              className="md:size-6"
            />
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-[24px]">
          <StatCard
            icon={
              <Image
                src="/images/volume.png"
                alt="avatar"
                width={26}
                height={40}
                className="h-3 w-auto md:h-4"
                style={{ objectFit: 'contain' }}
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
                width={24}
                height={40}
                className="h-3 w-auto md:h-4"
                style={{ objectFit: 'contain' }}
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
