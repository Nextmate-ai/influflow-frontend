/**
 * 检查 Token 余额 Hook
 * 用于验证用户是否有足够的 token 余额
 */

import { createThirdwebClient, getContract } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { useActiveWallet, useReadContract } from 'thirdweb/react';

import { THIRDWEB_CLIENT_ID, TOKEN_CONTRACT_ADDRESS } from '@/constants/env';

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

  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    contract: tokenContract,
    method: 'function balanceOf(address owner) view returns (uint256)',
    params: wallet
      ? [wallet.getAccount()?.address || '']
      : ['0x0000000000000000000000000000000000000000'],
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
