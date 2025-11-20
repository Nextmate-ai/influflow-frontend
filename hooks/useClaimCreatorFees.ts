/**
 * 领取创建者费用 Hook
 * 用于 creator 领取市场创建费用
 */
import { useSendTransaction, useActiveWallet } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { useMemo, useState } from 'react';
import { predictionMarketContract } from '@/lib/contracts/predictionMarket';

export interface ClaimCreatorFeesParams {
  marketId: bigint;
}

export function useClaimCreatorFees() {
  const { mutate: sendTransaction, isPending, error } = useSendTransaction();
  const wallet = useActiveWallet();
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');

  const claimCreatorFees = useMemo(
    () =>
      (params: ClaimCreatorFeesParams): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (!wallet) {
            reject(new Error('Wallet not connected'));
            return;
          }

          setCurrentStep('processing');

          const transaction = prepareContractCall({
            contract: predictionMarketContract,
            method:
              'function claimCreatorFees(uint256 marketId) returns (uint256 amount)',
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
    claimCreatorFees,
    isPending,
    currentStep,
    error,
  };
}

