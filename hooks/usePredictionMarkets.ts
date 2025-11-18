/**
 * 从 Supabase markets_readable 表读取预测市场数据
 */

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PredictionCardData } from '@/components/launchpad/dashboard/PredictionCard';

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
  state?: number;
  outcome?: number;
  yes_pool_total?: number | string;
  no_pool_total?: number | string;
  yes_shares_total?: number | string;
  no_shares_total?: number | string;
  total_volume?: number | string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // 允许其他字段
}

/**
 * 从 Supabase 读取预测市场列表
 */
export function usePredictionMarkets() {
  const [predictions, setPredictions] = useState<PredictionCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const supabase = createClient();

        // 从 nextmate schema 的 markets_readable 表读取数据
        // 如果表在 nextmate schema 中，使用 .schema('nextmate')
        // 如果表在 public schema 中，直接使用表名
        const { data, error: queryError } = await supabase
          .schema('nextmate')
          .from('markets_readable')
          .select('*')
          .order('created_at', { ascending: false });

        if (queryError) {
          throw new Error(`Supabase query error: ${queryError.message}`);
        }

        if (!data || data.length === 0) {
          setPredictions([]);
          return;
        }

        // 转换数据格式
        const mappedPredictions = data.map((row: MarketReadableRow) =>
          mapMarketRowToPredictionCard(row),
        );

        setPredictions(mappedPredictions);
      } catch (err) {
        console.error('Failed to fetch prediction markets:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch prediction markets'),
        );
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  return {
    predictions,
    isLoading,
    error,
  };
}

/**
 * 将 Supabase 行数据映射为 PredictionCardData
 */
function mapMarketRowToPredictionCard(
  row: MarketReadableRow,
): PredictionCardData {
  const marketId = String(row.market_id || row.id || '');
  
  // 计算百分比
  const yesTotal = parseFloat(String(row.yes_pool_total || 0));
  const noTotal = parseFloat(String(row.no_pool_total || 0));
  const total = yesTotal + noTotal;

  const yesPercentage = total > 0 ? Math.round((yesTotal / total) * 100) : 50;
  const noPercentage = total > 0 ? Math.round((noTotal / total) * 100) : 50;

  // 格式化交易量
  const totalVolume = formatVolume(row.total_volume);

  // 计算剩余时间
  const timeRemaining = calculateTimeRemaining(row.end_time);

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
function calculateTimeRemaining(
  endTime: string | number | undefined,
): string {
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
function generateAvatarUrl(creator: string | undefined): string {
  if (!creator) {
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
  }

  // 使用 creator 地址的一部分作为 seed
  const seed = creator.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '') || 'default';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

