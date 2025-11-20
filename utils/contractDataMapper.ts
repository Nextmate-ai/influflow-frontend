/**
 * 合约数据映射工具
 * 将合约返回的数据格式转换为前端组件所需的格式
 */

import { PredictionCardData } from '@/components/launchpad/dashboard/PredictionCard';
import { MarketResponse } from '@/lib/contracts/predictionMarket';

/**
 * 格式化 BigInt 为可读的字符串
 */
function formatBigInt(value: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const whole = value / divisor;
  const fraction = value % divisor;

  if (fraction === BigInt(0)) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(decimals, '0');
  const trimmed = fractionStr.replace(/0+$/, '');

  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}

/**
 * 格式化交易量
 */
function formatVolume(volume: bigint): string {
  const num = Number(volume) / 1e18; // 假设使用 18 位小数

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M Vol.`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k Vol.`;
  } else {
    return `${num.toFixed(2)} Vol.`;
  }
}

/**
 * 计算剩余时间
 */
function calculateTimeRemaining(endTime: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const end = Number(endTime);
  const remaining = end - now;

  if (remaining <= 0) {
    return 'Ended';
  }

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 0) {
    return `${days}d : ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h : ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * 生成头像 URL（基于 creator 地址）
 */
function generateAvatarUrl(creator: string): string {
  // 使用 creator 地址生成确定性头像
  const seed = creator.slice(2, 10); // 使用地址的一部分作为 seed
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

/**
 * 将合约返回的市场数据映射为前端 PredictionCardData 格式
 */
export function mapMarketDataToPredictionCard(
  marketId: string,
  marketData: MarketResponse | null | undefined,
): PredictionCardData | null {
  if (!marketData) {
    return null;
  }

  const { config, data } = marketData;

  // 计算百分比
  const yesTotal = Number(data.yesPoolTotal);
  const noTotal = Number(data.noPoolTotal);
  const total = yesTotal + noTotal;

  const yesPercentage = total > 0 ? Math.round((yesTotal / total) * 100) : 50;
  const noPercentage = total > 0 ? Math.round((noTotal / total) * 100) : 50;

  return {
    id: marketId,
    title: config.questionTitle || 'Untitled Market',
    image: generateAvatarUrl(config.creator),
    percentage: yesPercentage, // 用于兼容现有组件
    yesPercentage,
    noPercentage,
    totalVolume: formatVolume(data.totalVolume),
    timeRemaining: calculateTimeRemaining(config.endTime),
    option: '', // 默认不选择
  };
}
