/**
 * 领取测试 Token Hook
 * 调用合约的 claim() 方法领取测试代币
 */

import { FAUCET_CONTRACT_ADDRESS, THIRDWEB_CLIENT_ID } from '@/constants/env';
import { createThirdwebClient, getContract } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { useMemo } from 'react';
import { prepareContractCall } from 'thirdweb';
import { useSendTransaction } from 'thirdweb/react';

// 创建 Thirdweb 客户端
const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

// 创建 Faucet 合约实例
const faucetContract = getContract({
  client,
  chain: baseSepolia,
  address: FAUCET_CONTRACT_ADDRESS,
});

export interface ClaimTokenOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 领取测试 Token
 * 可以重复调用
 */
export function useTokenClaim() {
  const { mutate: sendTransaction, isPending, error } = useSendTransaction();

  const claim = useMemo(
    () => (options?: ClaimTokenOptions) => {
      const transaction = prepareContractCall({
        contract: faucetContract,
        method: 'function claim()',
        params: [],
      });
      sendTransaction(transaction, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: (error) => {
          const err = error instanceof Error ? error : new Error(String(error));
          options?.onError?.(err);
        },
      });
    },
    [sendTransaction],
  );

  return {
    claim,
    isPending,
    error,
  };
}
