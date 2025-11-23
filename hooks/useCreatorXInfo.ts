import { useEffect, useState, useCallback, useRef } from 'react';

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
 * 批量获取多个钱包地址对应的 X（Twitter）信息
 * @param addresses 钱包地址数组
 * @returns Map<address, CreatorXInfo | null> - 地址到 X 信息的映射，null 表示未找到
 */
export function useCreatorXInfo(addresses: string[]) {
  const [data, setData] = useState<Map<string, CreatorXInfo | null>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 使用 ref 缓存已请求的地址，避免重复请求
  const fetchedAddressesRef = useRef<Set<string>>(new Set());

  const fetchCreatorXInfo = useCallback(
    async (address: string): Promise<[string, CreatorXInfo | null]> => {
      try {
        const response = await fetch(
          `/api/privy/user-by-address?address=${encodeURIComponent(address)}`,
        );

        if (!response.ok) {
          // 404 或其他错误都返回 null
          return [address, null];
        }

        const result: ApiResponse = await response.json();

        if (!result.found || !result.twitter) {
          return [address, null];
        }

        return [
          address,
          {
            username: result.twitter.username,
            name: result.twitter.name,
            avatarUrl: getHighResTwitterAvatar(result.twitter.avatarUrl),
          },
        ];
      } catch (err) {
        console.error(`Failed to fetch X info for ${address}:`, err);
        return [address, null];
      }
    },
    [],
  );

  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      return;
    }

    // 过滤出未请求过的地址
    const newAddresses = addresses.filter(
      (addr) => !fetchedAddressesRef.current.has(addr) && addr,
    );

    if (newAddresses.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // 批量请求（使用 Promise.allSettled 避免单个失败影响全部）
    Promise.allSettled(newAddresses.map(fetchCreatorXInfo))
      .then((results) => {
        setData((prevData) => {
          const newData = new Map(prevData);

          results.forEach((result) => {
            if (result.status === 'fulfilled') {
              const [address, xInfo] = result.value;
              newData.set(address, xInfo);
              fetchedAddressesRef.current.add(address);
            }
          });

          return newData;
        });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [addresses, fetchCreatorXInfo]);

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
