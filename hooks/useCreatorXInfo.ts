import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';

import { getHighResTwitterAvatar } from '@/utils/avatar';

export interface CreatorXInfo {
  username?: string;
  name?: string;
  avatarUrl?: string;
}

interface ApiResponse {
  found: boolean;
  address?: string;
  twitter?: {
    username?: string;
    name?: string;
    avatarUrl?: string;
  };
  reason?: string;
}

/**
 * 获取单个地址的 X 信息（API 调用函数）
 */
async function fetchCreatorXInfo(
  address: string,
): Promise<CreatorXInfo | null> {
  try {
    const response = await fetch(
      `/api/privy/user-by-address?address=${encodeURIComponent(address)}`,
    );

    if (!response.ok) {
      // 404 或其他错误都返回 null
      return null;
    }

    const result: ApiResponse = await response.json();

    if (!result.found || !result.twitter) {
      return null;
    }

    return {
      username: result.twitter.username,
      name: result.twitter.name,
      avatarUrl: getHighResTwitterAvatar(result.twitter.avatarUrl),
    };
  } catch (err) {
    console.error(`Failed to fetch X info for ${address}:`, err);
    return null;
  }
}

/**
 * 批量获取多个钱包地址对应的 X（Twitter）信息
 * 使用 React Query 实现自动去重和缓存
 * @param addresses 钱包地址数组
 * @returns Map<address, CreatorXInfo | null> - 地址到 X 信息的映射，null 表示未找到
 */
export function useCreatorXInfo(addresses: string[]) {
  // 去重地址列表
  const uniqueAddresses = useMemo(() => {
    return Array.from(new Set(addresses.filter(Boolean)));
  }, [addresses]);

  // 使用 useQueries 为每个地址创建独立的查询
  const queries = useQueries({
    queries: uniqueAddresses.map((address) => ({
      queryKey: ['creator-x-info', address],
      queryFn: () => fetchCreatorXInfo(address),
      staleTime: 5 * 60 * 1000, // 5分钟内认为数据是新鲜的
      gcTime: 10 * 60 * 1000, // 10分钟后清除缓存
      retry: 1, // 失败重试1次
      enabled: !!address, // 只在地址存在时启用查询
    })),
  });

  // 将 queries 结果转换为 Map 格式（保持向后兼容）
  const data = useMemo(() => {
    const resultMap = new Map<string, CreatorXInfo | null>();

    uniqueAddresses.forEach((address, index) => {
      const query = queries[index];
      if (query.data !== undefined) {
        resultMap.set(address, query.data);
      }
    });

    return resultMap;
  }, [uniqueAddresses, queries]);

  // 计算整体加载状态
  const isLoading = queries.some((query) => query.isLoading);

  // 收集错误（如果有）
  const error = queries.find((query) => query.error)?.error as Error | null;

  return {
    data,
    isLoading,
    error,
  };
}

/**
 * 获取单个钱包地址的 X 信息
 * @param address 钱包地址
 */
export function useSingleCreatorXInfo(address: string | undefined) {
  const { data, isLoading, error } = useCreatorXInfo(
    address ? [address] : [],
  );

  return {
    xInfo: address ? data.get(address) : null,
    isLoading,
    error,
  };
}
