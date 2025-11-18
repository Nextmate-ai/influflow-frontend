/**
 * 检查 Token 余额 Hook
 * 用于验证用户是否有足够的 token 余额
 */

import { useReadContract } from 'thirdweb/react';
import { useMemo } from 'react';
import { getContract } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { createThirdwebClient } from 'thirdweb';
import { useActiveWallet } from 'thirdweb/react';

import { THIRDWEB_CLIENT_ID } from '@/constants/env';

// Token 合约地址
const TOKEN_CONTRACT_ADDRESS = '0xC5387F42883F6AfBa3AA935764Ac79a112aE1897';

// 创建 Thirdweb 客户端
const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

// 创建 Token 合约实例
const tokenContract = getContract({
  client,
  chain: baseSepolia,
  address: TOKEN_CONTRACT_ADDRESS,
});

/**
 * 检查用户 Token 余额
 */
export function useTokenBalance() {
  const wallet = useActiveWallet();

  const { data: balance, isLoading, error } = useReadContract({
    contract: tokenContract,
    method: 'function balanceOf(address owner) view returns (uint256)',
    params: wallet ? [wallet.getAccount()?.address || ''] : ['0x0000000000000000000000000000000000000000'],
    queryOptions: {
      enabled: !!wallet,
    },
  });

  return {
    balance: balance ? BigInt(balance.toString()) : BigInt(0),
    isLoading,
    error,
  };
}

