/**
 * 领取预测市场奖励 Hook
 * 用于在市场结束后领取收益
 */
import { useSendTransaction, useActiveWallet } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { useMemo, useState } from 'react';
import { predictionMarketContract } from '@/lib/contracts/predictionMarket';

export interface ClaimPayoutParams {
  marketId: bigint;
}

export function useClaimPayout() {
  const { mutate: sendTransaction, isPending, error } = useSendTransaction();
  const wallet = useActiveWallet();
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');

  const claimPayout = useMemo(
    () =>
      (params: ClaimPayoutParams): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (!wallet) {
            reject(new Error('Wallet not connected'));
            return;
          }

          setCurrentStep('processing');

          const transaction = prepareContractCall({
            contract: predictionMarketContract,
            method: 'function claim(uint256 marketId) returns (uint256 amount)',
            params: [params.marketId],
          });

          sendTransaction(transaction, {
            onSuccess: () => {
              setCurrentStep('success');
              resolve();
            },
            onError: (error) => {
              setCurrentStep('error');
              reject(error);
            },
          });
        });
      },
    [wallet, sendTransaction],
  );

  return {
    claimPayout,
    isPending,
    currentStep,
    error,
  };
}
