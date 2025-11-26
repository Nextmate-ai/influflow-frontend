/**
 * 从 Supabase markets_readable 表读取预测市场数据
 */

import { PredictionCardData } from '@/components/launchpad/dashboard/PredictionCard';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useCreatorXInfo } from './useCreatorXInfo';

/**
 * Supabase markets_readable 表的数据结构
 * 根据实际表结构可能需要调整
 */
export interface MarketReadableRow {
  id?: string;
  market_id?: number | string;
  question_title?: string;
  question_description?: string;
  creator?: string;
  end_time?: string | number;
  state?: number | string; // 支持字符串类型(如 "Active", "Resolved")
  outcome?: number | string; // 支持字符串类型(如 "Yes", "No", "None")
  yes_pool_total?: number | string;
  no_pool_total?: number | string;
  yes_shares_total?: number | string;
  no_shares_total?: number | string;
  total_volume?: number | string;
  creator_fees_usd?: number | string; // 创建者费用
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // 允许其他字段
}

/**
 * 从 Supabase 读取预测市场列表
 */
export function usePredictionMarkets() {
  const [basePredictions, setBasePredictions] = useState<PredictionCardData[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // 使用 ref 来跟踪请求状态，避免状态更新延迟导致的问题
  const isFetchingRef = useRef(false);

  const fetchMarkets = async () => {
    // 防止重复请求 - 使用 ref 而不是 state
    if (isFetchingRef.current) {
      console.log('Already fetching markets, skipping...');
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const supabase = createClient();

      console.log('Fetching markets from Supabase...');

      // 从 nextmate schema 的 markets_readable 表读取数据
      const { data, error: queryError } = await supabase
        .schema('nextmate')
        .from('markets_readable')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (queryError) {
        console.error('Supabase query error:', queryError);
        throw new Error(`Supabase query error: ${queryError.message}`);
      }

      console.log('Markets fetched successfully:', data?.length || 0);

      if (!data || data.length === 0) {
        setBasePredictions([]);
        return;
      }

      // 转换数据格式
      const mappedPredictions = data.map((row: MarketReadableRow) =>
        mapMarketRowToPredictionCard(row),
      );
      setBasePredictions(mappedPredictions);
    } catch (err) {
      console.error('Failed to fetch prediction markets:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch prediction markets'),
      );
      setBasePredictions([]);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchMarkets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // 提取所有 creator 地址
  // React Query 会自动处理去重和缓存，无需手动优化
  const creatorAddresses = useMemo(() => {
    return basePredictions
      .map((p) => p.rawData?.creator as string)
      .filter(Boolean);
  }, [basePredictions]);

  // 批量获取 creator 的 X 信息
  const {
    data: creatorXInfoMap,
    isLoading: isLoadingXInfo,
  } = useCreatorXInfo(creatorAddresses);

  // 合并 X 信息到预测数据
  const predictions = useMemo(() => {
    return basePredictions.map((prediction) => {
      const creatorAddress = prediction.rawData?.creator as string;
      if (!creatorAddress) {
        return prediction;
      }

      const xInfo = creatorXInfoMap.get(creatorAddress);

      return {
        ...prediction,
        creatorInfo: {
          address: creatorAddress,
          xUsername: xInfo?.username,
          xName: xInfo?.name,
          xAvatarUrl: xInfo?.avatarUrl,
        },
      };
    });
  }, [basePredictions, creatorXInfoMap]);

  // 提供刷新函数 - 使用 useCallback 保持引用稳定
  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return {
    predictions,
    isLoading: isLoading || isLoadingXInfo,
    error,
    refresh,
  };
}

/**
 * 计算投票百分比
 * 优先级：invested_ratio > price > pool 数据计算
 */
function calculatePercentages(rawData: Record<string, any>): {
  yesPercentage: number;
  noPercentage: number;
} {
  // 提取数据源
  const yesInvestedRatio = rawData.yes_invested_ratio || rawData.yesInvestedRatio;
  const noInvestedRatio = rawData.no_invested_ratio || rawData.noInvestedRatio;
  const yesPrice = rawData.yes_price || rawData.yesPrice;
  const noPrice = rawData.no_price || rawData.noPrice;
  const yesPoolUsd = parseFloat(
    String(rawData.yes_pool_usd || rawData.yesPoolUsd || rawData.yes_pool_total || rawData.yesPoolTotal || 0)
  );
  const noPoolUsd = parseFloat(
    String(rawData.no_pool_usd || rawData.noPoolUsd || rawData.no_pool_total || rawData.noPoolTotal || 0)
  );
  const poolTotal = yesPoolUsd + noPoolUsd;

  // 计算百分比的辅助函数
  const calcPercentage = (ratio: any, price: any, poolUsd: number, fallback: number): number => {
    if (ratio !== undefined) return parseFloat(String(ratio)) * 100;
    if (price !== undefined) return Math.round(parseFloat(String(price)) * 100);
    if (poolTotal > 0) return Math.round((poolUsd / poolTotal) * 100);
    return fallback;
  };

  // 处理边界情况
  if (yesPoolUsd === 0 && noPoolUsd === 0) {
    return { yesPercentage: 0, noPercentage: 0 };
  }
  if (noPoolUsd === 0) {
    return { yesPercentage: 100, noPercentage: 0 };
  }
  if (yesPoolUsd === 0) {
    return { yesPercentage: 0, noPercentage: 100 };
  }

  // 正常情况
  const yesPercentage = calcPercentage(yesInvestedRatio, yesPrice, yesPoolUsd, 50);
  const noPercentage = calcPercentage(noInvestedRatio, noPrice, noPoolUsd, 50);

  return { yesPercentage, noPercentage };
}

/**
 * 将 Supabase 行数据映射为 PredictionCardData
 */
function mapMarketRowToPredictionCard(
  row: MarketReadableRow,
): PredictionCardData {
  const marketId = String(row.market_id || row.id || '');

  // 使用统一的百分比计算函数
  const { yesPercentage, noPercentage } = calculatePercentages(
    row as Record<string, any>,
  );

  // 格式化交易量 - 支持多种字段名
  const volumeValue =
    row.total_volume_usd ||
    row.total_volume ||
    row.totalVolumeUsd ||
    row.totalVolume;
  const totalVolume = formatVolume(volumeValue);

  // 计算剩余时间 - 对于 Resolved 或 Void 状态的市场，直接显示 "0"
  const state = row.state;
  let timeRemaining: string;
  if (state === 1 || state === '1' || state === 'Resolved' || state === 2 || state === '2' || state === 'Void') {
    timeRemaining = '0';
  } else {
    timeRemaining = calculateTimeRemaining(row.end_time);
  }

  // 生成头像 URL（基于 creator 地址）
  const image = generateAvatarUrl(row.creator || marketId);

  return {
    id: marketId,
    title: row.question_title || 'Untitled Market',
    image,
    percentage: yesPercentage,
    yesPercentage,
    noPercentage,
    totalVolume,
    timeRemaining,
    option: '',
    // 保存完整的原始数据
    rawData: row as Record<string, any>,
  };
}

/**
 * 格式化交易量
 */
function formatVolume(volume: number | string | undefined): string {
  if (!volume) {
    return '0 Vol.';
  }

  const num = typeof volume === 'string' ? parseFloat(volume) : volume;

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
function calculateTimeRemaining(endTime: string | number | undefined): string {
  if (!endTime) {
    return 'N/A';
  }

  let endTimestamp: number;

  if (typeof endTime === 'string') {
    // 如果是 ISO 字符串，转换为时间戳
    endTimestamp = new Date(endTime).getTime() / 1000;
  } else {
    // 如果已经是时间戳（秒），直接使用
    endTimestamp = endTime;
  }

  const now = Math.floor(Date.now() / 1000);
  const remaining = endTimestamp - now;

  if (remaining <= 0) {
    return '0';
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
function generateAvatarUrl(creator: string | undefined): string {
  if (!creator) {
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
  }

  // 使用 creator 地址的一部分作为 seed
  const seed = creator.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '') || 'default';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}
