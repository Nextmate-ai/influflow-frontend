/**
 * 读取单个预测市场数据的 Hook
 * 使用 wagmi 的 useReadContract
 */

import { useMemo } from 'react';
import { useReadContract } from 'wagmi';

import { PredictionCardData } from '@/components/launchpad/dashboard/PredictionCard';
import {
  MarketResponse,
  predictionMarketContract,
} from '@/lib/contracts/predictionMarket';
import { mapMarketDataToPredictionCard } from '@/utils/contractDataMapper';

/**
 * 读取单个预测市场数据
 * @param marketId 市场 ID
 */
export function usePredictionMarket(
  marketId: string | number | null | undefined,
) {
  const marketIdBigInt = useMemo(() => {
    if (marketId === null || marketId === undefined) {
      return null;
    }
    return BigInt(marketId);
  }, [marketId]);

  const { data, isLoading, error } = useReadContract({
    ...predictionMarketContract,
    functionName: 'getMarket',
    args: marketIdBigInt !== null ? [marketIdBigInt] : undefined,
    query: {
      enabled: marketIdBigInt !== null,
    },
  });

  const prediction = useMemo<PredictionCardData | null>(() => {
    if (!data || !marketId) {
      return null;
    }
    // data 是一个元组 [config, data]，需要转换为 MarketResponse 格式
    const marketResponse: MarketResponse = {
      config: data[0],
      data: data[1],
    };
    return mapMarketDataToPredictionCard(String(marketId), marketResponse);
  }, [data, marketId]);

  return {
    prediction,
    rawData: data,
    isLoading,
    error,
  };
}
