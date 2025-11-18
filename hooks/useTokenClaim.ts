/**
 * 领取测试 Token Hook
 * 调用合约的 claim() 方法领取测试代币
 */

import { useSendTransaction } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { useMemo } from 'react';
import { predictionMarketContract } from '@/lib/contracts/predictionMarket';

/**
 * 领取测试 Token
 * 可以重复调用
 */
export function useTokenClaim() {
  const { mutate: sendTransaction, isPending, error } = useSendTransaction();

  const claim = useMemo(
    () => () => {
      const transaction = prepareContractCall({
        contract: predictionMarketContract,
        method: 'function claim()',
        params: [],
      });
      sendTransaction(transaction);
    },
    [sendTransaction],
  );

  return {
    claim,
    isPending,
    error,
  };
}

