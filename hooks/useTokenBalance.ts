/**
 * 检查 Token 余额 Hook
 * 用于验证用户是否有足够的 token 余额
 */

import { useWallets } from '@privy-io/react-auth';
import { useReadContract } from 'wagmi';

import { tokenContract } from '@/lib/contracts/predictionMarket';

/**
 * 检查用户 Token 余额
 */
export function useTokenBalance() {
  const { wallets } = useWallets();
  const address = wallets[0]?.address;

  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    ...tokenContract,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: balance ? BigInt(balance.toString()) : BigInt(0),
    isLoading,
    error,
  };
}
