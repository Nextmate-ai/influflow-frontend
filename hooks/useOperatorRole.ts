/**
 * Operator Role Hook
 * 用于检查用户的 operator 权限
 * 在钱包连接时检查一次并缓存,避免重复调用合约
 */

import { useEffect, useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { useReadContract } from 'wagmi';

import { predictionMarketContract } from '@/lib/contracts/predictionMarket';

// Operator role hash
const OPERATOR_ROLE =
  '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929' as const;

/**
 * Hook: 检查用户是否有 operator 权限
 * 会在钱包连接时检查一次,结果缓存在内存中
 */
export function useOperatorRole() {
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address || '';

  // 缓存权限结果(内存缓存)
  const [hasOperatorRole, setHasOperatorRole] = useState<boolean | undefined>(undefined);
  const [lastCheckedAddress, setLastCheckedAddress] = useState<string>('');

  // 只有在地址变化时才重新检查
  const shouldFetch = !!walletAddress && walletAddress !== lastCheckedAddress;

  const { data: contractRole } = useReadContract({
    ...predictionMarketContract,
    functionName: 'hasRole',
    args: shouldFetch ? [OPERATOR_ROLE, walletAddress as `0x${string}`] : undefined,
    query: {
      enabled: shouldFetch,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity, // 永不过期
    },
  }) as { data: boolean | undefined };

  // 当合约返回结果时,更新状态
  useEffect(() => {
    if (walletAddress && contractRole !== undefined) {
      setHasOperatorRole(contractRole);
      setLastCheckedAddress(walletAddress);
    }
  }, [walletAddress, contractRole]);

  // 当钱包地址变化时,重置状态
  useEffect(() => {
    if (!walletAddress) {
      setHasOperatorRole(undefined);
      setLastCheckedAddress('');
    }
  }, [walletAddress]);

  if (hasOperatorRole === true) {
    console.log(`Address ${walletAddress} has operator role:`, hasOperatorRole);
  }

  return {
    hasOperatorRole,
  };
}
