/**
 * 获取用户参与/创建的市场数据 Hook
 * 从 Supabase markets_readable 表读取数据，根据 viewType 过滤
 */

import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { MarketReadableRow } from './usePredictionMarkets';

export interface ParticipationRowData {
  prediction: string;
  totalVolume: string;
  rewards: number;
  time: string;
  status: 'Ongoing' | 'Finished' | 'Voided' | 'Resolved';
  outcome: 'Yes' | 'No' | null;
  opinion?: 'Yes' | 'No' | null;
  marketId?: string;
  betAmount?: number; // 用户投注金额
  expectedPayout?: number; // 预期收益
  claimed?: boolean; // 是否已领取
  marketOutcome?: 'Yes' | 'No' | null; // 市场结果
  marketState?: string; // 市场状态 (Active/Resolved 等)
  totalInvestment?: number; // 总投资金额
  creatorFeesClaimed?: boolean; // Creator 费用是否已领取
}

/**
 * positions_readable 表的数据结构
 */
export interface PositionReadableRow {
  id?: string;
  user_address?: string;
  market_id?: number | string;
  yes_shares?: number | string;
  no_shares?: number | string;
  yes_investment_usd?: number | string;
  no_investment_usd?: number | string;
  total_investment_usd?: number | string;
  expected_payout_usd?: number | string;
  claimed?: boolean | string;
  market_state?: string;
  market_outcome?: string;
  market_question?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // 允许其他字段
}

type ViewType = 'participations' | 'creations';

/**
 * 移除地址前缀（如 eq.）
 * 数据库中的地址没有前缀，需要移除前端传入的前缀
 */
function removeAddressPrefix(address: string): string {
  if (!address) {
    return address;
  }
  // 移除 eq. 前缀（不区分大小写）
  const lowerAddress = address.toLowerCase();
  if (lowerAddress.startsWith('eq.')) {
    return lowerAddress.slice(3); // 移除 "eq." (3个字符)
  }
  return lowerAddress;
}

/**
 * 获取用户参与或创建的市场数据
 */
export function useUserParticipations(viewType: ViewType = 'creations') {
  const { wallets } = useWallets();
  const [participations, setParticipations] = useState<ParticipationRowData[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchParticipations = async () => {
      const userAddress = wallets[0]?.address;

      if (!userAddress) {
        setParticipations([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 移除地址前缀，数据库中的地址没有前缀
        const normalizedAddress = removeAddressPrefix(userAddress);

        const supabase = createClient();

        if (viewType === 'creations') {
          // Creations: 查询 creator = 当前用户地址的市场
          const { data, error: queryError } = await supabase
            .schema('nextmate')
            .from('markets_readable')
            .select('*')
            .eq('creator', normalizedAddress)
            .order('created_at', { ascending: false });

          if (queryError) {
            throw new Error(`Supabase query error: ${queryError.message}`);
          }

          if (!data || data.length === 0) {
            setParticipations([]);
            return;
          }

          // 转换数据格式
          const mappedData = data.map((row: MarketReadableRow) =>
            mapMarketRowToParticipation(row, viewType),
          );

          setParticipations(mappedData);
        } else {
          // Participations: 从 positions_readable 表查询用户参与记录
          // 1. 查询 positions_readable 表，过滤 user_address = 当前用户地址
          const { data: positionsData, error: positionsError } = await supabase
            .schema('nextmate')
            .from('positions_readable')
            .select('*')
            .eq('user_address', normalizedAddress);

          if (positionsError) {
            throw new Error(
              `Supabase positions query error: ${positionsError.message}`,
            );
          }

          if (!positionsData || positionsData.length === 0) {
            setParticipations([]);
            return;
          }

          // 2. 获取所有唯一的 market_id
          const marketIds = [
            ...new Set(
              positionsData
                .map((p: PositionReadableRow) => p.market_id)
                .filter(
                  (id: string | number | undefined | null): id is string | number =>
                    id !== undefined && id !== null,
                ),
            ),
          ];

          if (marketIds.length === 0) {
            setParticipations([]);
            return;
          }

          // 3. 批量查询 markets_readable 表获取市场信息
          const { data: marketsData, error: marketsError } = await supabase
            .schema('nextmate')
            .from('markets_readable')
            .select('*')
            .in('market_id', marketIds);

          if (marketsError) {
            throw new Error(
              `Supabase markets query error: ${marketsError.message}`,
            );
          }

          if (!marketsData || marketsData.length === 0) {
            setParticipations([]);
            return;
          }

          // 4. 创建 market_id 到 market 数据的映射
          const marketMap = new Map<string | number, MarketReadableRow>();
          marketsData.forEach((market: MarketReadableRow) => {
            const marketId = market.market_id || market.id;
            if (marketId) {
              marketMap.set(String(marketId), market);
            }
          });

          // 5. 根据 yes_shares 和 no_shares 生成记录
          // 使用数组存储记录和原始时间戳，以便排序
          const participationRecordsWithTime: Array<{
            record: ParticipationRowData;
            timestamp: string;
          }> = [];

          positionsData.forEach((position: PositionReadableRow) => {
            const marketId = String(position.market_id || '');
            const market = marketMap.get(marketId);

            if (!market) {
              return; // 如果找不到对应的市场，跳过
            }

            const yesShares = parseFloat(String(position.yes_shares || 0));
            const noShares = parseFloat(String(position.no_shares || 0));

            // 获取原始时间戳用于排序
            const timestamp =
              position.created_at ||
              position.updated_at ||
              market.created_at ||
              '';

            // 如果有 yes_shares，生成一条 Yes 记录
            if (yesShares > 0) {
              const yesRecord = mapPositionToParticipation(
                position,
                market,
                'Yes',
                yesShares,
              );
              participationRecordsWithTime.push({
                record: yesRecord,
                timestamp,
              });
            }

            // 如果有 no_shares，生成一条 No 记录
            if (noShares > 0) {
              const noRecord = mapPositionToParticipation(
                position,
                market,
                'No',
                noShares,
              );
              participationRecordsWithTime.push({
                record: noRecord,
                timestamp,
              });
            }
          });

          // 6. 按时间排序（最新的在前）
          participationRecordsWithTime.sort((a, b) => {
            if (!a.timestamp || !b.timestamp) {
              return 0;
            }
            return (
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
          });

          // 提取排序后的记录
          const participationRecords = participationRecordsWithTime.map(
            (item) => item.record,
          );

          setParticipations(participationRecords);
        }
      } catch (err) {
        console.error('Failed to fetch user participations:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch user participations'),
        );
        setParticipations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipations();
  }, [wallets, viewType, refetchTrigger]);

  // Refetch 函数，用于手动刷新数据
  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return {
    participations,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 将 Position 和 Market 数据转换为 ParticipationRowData
 */
function mapPositionToParticipation(
  position: PositionReadableRow,
  market: MarketReadableRow,
  opinion: 'Yes' | 'No',
  shares: number,
): ParticipationRowData {
  // 格式化交易量
  const volumeValue =
    market.total_volume_usd ||
    market.total_volume ||
    market.totalVolumeUsd ||
    market.totalVolume;
  const totalVolume = formatVolume(volumeValue);

  // 格式化时间 - 使用 position 的创建时间或更新时间
  const time = formatTime(
    position.created_at || position.updated_at || market.created_at,
  );

  // 判断状态
  const status = determineStatus(market.state, market.end_time);

  // 转换 outcome (市场结果)
  const marketOutcome = convertOutcome(market.outcome);

  // 计算投注金额
  const yesInvestment = parseFloat(String(position.yes_investment_usd || 0));
  const noInvestment = parseFloat(String(position.no_investment_usd || 0));
  const betAmount = opinion === 'Yes' ? yesInvestment : noInvestment;

  // 获取预期收益
  const expectedPayout = parseFloat(String(position.expected_payout_usd || 0));

  // 获取是否已领取
  const claimed = position.claimed === true || position.claimed === 'true';

  // 计算收益（暂时使用占位符，实际需要根据用户的选择和 outcome 计算）
  const rewards = calculatePositionRewards(
    market,
    opinion,
    shares,
    marketOutcome,
  );

  // outcome 字段保留原来的逻辑（用于兼容）
  const outcome = marketOutcome;

  // 获取总投资金额
  const totalInvestment = parseFloat(
    String(position.total_investment_usd || 0),
  );

  return {
    prediction:
      market.question_title || market.market_question || 'Untitled Market',
    totalVolume,
    rewards,
    time,
    status,
    outcome,
    opinion,
    marketId: String(position.market_id || market.market_id || market.id || ''),
    betAmount,
    expectedPayout,
    claimed,
    marketOutcome,
    marketState:
      position.market_state ||
      market.market_state ||
      market.state?.toString() ||
      '',
    totalInvestment,
  };
}

/**
 * 将 MarketReadableRow 转换为 ParticipationRowData
 */
function mapMarketRowToParticipation(
  row: MarketReadableRow,
  viewType: ViewType,
): ParticipationRowData {
  // 格式化交易量
  const volumeValue =
    row.total_volume_usd ||
    row.total_volume ||
    row.totalVolumeUsd ||
    row.totalVolume;
  const totalVolume = formatVolume(volumeValue);

  // 格式化时间
  const time = formatTime(row.created_at || row.updated_at);

  // 判断状态
  // 对于 creations 视图，根据 market state 直接返回状态
  let status: 'Ongoing' | 'Finished' | 'Voided' | 'Resolved';
  if (viewType === 'creations') {
    const state = row.state?.toString() || '';
    const stateLower = state.toLowerCase();
    if (stateLower === 'active') {
      status = 'Ongoing';
    } else if (stateLower === 'voided') {
      status = 'Voided';
    } else if (stateLower === 'resolved') {
      status = 'Resolved';
    } else {
      // 其他状态默认使用原来的逻辑
      status = determineStatus(row.state, row.end_time);
    }
  } else {
    // 对于 participations 视图，使用原来的逻辑
    status = determineStatus(row.state, row.end_time);
  }

  // 转换 outcome
  const outcome = convertOutcome(row.outcome);

  // 计算收益（暂时使用占位符，实际需要根据用户的选择和 outcome 计算）
  const rewards = calculateRewards(row, viewType);

  // 对于 participations，需要获取用户的 opinion（Yes/No）
  // 暂时设为 null，后续需要从合约或数据库查询
  const opinion: 'Yes' | 'No' | null = null;

  // 获取 market state
  const marketState = row.state?.toString() || '';

  // 获取 creator_fees_claimed 字段
  const creatorFeesClaimed =
    row.creator_fees_claimed === true ||
    row.creator_fees_claimed === 'true' ||
    row.creatorFeesClaimed === true ||
    row.creatorFeesClaimed === 'true';

  return {
    prediction: row.question_title || 'Untitled Market',
    totalVolume,
    rewards,
    time,
    status,
    outcome,
    opinion,
    marketId: String(row.market_id || row.id || ''),
    marketState,
    creatorFeesClaimed,
  };
}

/**
 * 格式化交易量
 */
function formatVolume(volume: number | string | undefined): string {
  if (!volume) {
    return '$0';
  }

  const num = typeof volume === 'string' ? parseFloat(volume) : volume;

  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}m`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}k`;
  } else {
    return `$${num.toFixed(2)}`;
  }
}

/**
 * 格式化时间
 */
function formatTime(time: string | undefined): string {
  if (!time) {
    return 'N/A';
  }

  try {
    const date = new Date(time);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return 'N/A';
  }
}

/**
 * 判断市场状态
 * 支持 state 为数字或字符串类型
 */
function determineStatus(
  state: number | string | undefined,
  endTime: string | number | undefined,
): 'Ongoing' | 'Finished' {
  // 如果 state 存在，根据 state 判断
  if (state !== undefined && state !== null) {
    // 如果 state 是字符串类型
    if (typeof state === 'string') {
      const stateLower = state.toLowerCase();
      // "Active" 状态显示为 "Ongoing"
      if (stateLower === 'active') {
        return 'Ongoing';
      }
      // 其他状态(如 "Resolved", "Finished" 等)显示为 "Finished"
      return 'Finished';
    }

    // 如果 state 是数字类型
    // state 可能表示：0=Active, 1=Closed, 2=Resolved 等
    // 假设 0 或 1 表示 Ongoing，其他表示 Finished
    if (state === 0 || state === 1) {
      return 'Ongoing';
    }
    return 'Finished';
  }

  // 如果没有 state，根据 end_time 判断
  if (endTime) {
    let endTimestamp: number;

    if (typeof endTime === 'string') {
      endTimestamp = new Date(endTime).getTime() / 1000;
    } else {
      endTimestamp = endTime;
    }

    const now = Math.floor(Date.now() / 1000);
    return endTimestamp > now ? 'Ongoing' : 'Finished';
  }

  // 默认返回 Ongoing
  return 'Ongoing';
}

/**
 * 转换 outcome 值
 */
function convertOutcome(
  outcome: number | string | undefined,
): 'Yes' | 'No' | null {
  if (outcome === undefined || outcome === null) {
    return null;
  }

  // 如果是字符串类型
  if (typeof outcome === 'string') {
    const lowerOutcome = outcome.toLowerCase();
    if (lowerOutcome === 'yes') {
      return 'Yes';
    } else if (lowerOutcome === 'no') {
      return 'No';
    } else if (lowerOutcome === 'none') {
      return null;
    }
    return null;
  }

  // 如果是数字类型: 0 = No, 1 = Yes
  if (outcome === 0) {
    return 'No';
  } else if (outcome === 1) {
    return 'Yes';
  }

  return null;
}

/**
 * 计算 position 的收益
 * 暂时使用占位符，实际需要根据用户的选择和 outcome 计算
 */
function calculatePositionRewards(
  market: MarketReadableRow,
  opinion: 'Yes' | 'No',
  shares: number,
  outcome: 'Yes' | 'No' | null,
): number {
  // TODO: 实现真实的收益计算逻辑
  // 需要根据：
  // 1. 用户的 opinion (Yes/No)
  // 2. 市场的 outcome (Yes/No/null)
  // 3. shares 数量
  // 4. 当前市场价格或结算价格
  // 暂时返回占位符值
  return 0;
}

/**
 * 计算收益
 * 对于 creations: 使用 creator_fees_usd
 * 对于 participations: 需要根据用户的选择（Yes/No）和 outcome 计算盈亏
 */
function calculateRewards(row: MarketReadableRow, viewType: ViewType): number {
  if (viewType === 'creations') {
    // 对于 creations，使用 creator_fees_usd
    const creatorFees = row.creator_fees_usd;
    if (creatorFees !== undefined && creatorFees !== null) {
      return typeof creatorFees === 'string'
        ? parseFloat(creatorFees)
        : creatorFees;
    }
    return 0;
  }

  // 对于 participations: 暂时返回占位符值
  // TODO: 实现真实的收益计算逻辑
  return 0;
}
