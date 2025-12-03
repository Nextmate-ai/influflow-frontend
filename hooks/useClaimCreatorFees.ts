/**
 * 领取创建者费用 Hook
 * 用于 creator 领取市场创建费用
 * 使用 Privy 的 gas sponsorship（客户端直接调用）
 */

import { useCallback, useState } from 'react';
import { useSendTransaction } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';

import { predictionMarketContract } from '@/lib/contracts/predictionMarket';

export interface ClaimCreatorFeesParams {
  marketId: bigint;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useClaimCreatorFees() {
  const { sendTransaction } = useSendTransaction();
  const [isPending, setIsPending] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<Error | null>(null);

  const claimCreatorFees = useCallback(
    async (params: ClaimCreatorFeesParams): Promise<void> => {
      try {
        setIsPending(true);
        setError(null);
        setCurrentStep('processing');

        console.log('=== 开始领取创建者费用 ===');
        console.log('Market ID:', params.marketId.toString());

        // 编码合约调用数据
        const data = encodeFunctionData({
          abi: predictionMarketContract.abi,
          functionName: 'claimCreatorFees',
          args: [params.marketId],
        });

        // 使用 Privy 的 sendTransaction 并启用 gas sponsorship
        const txResult = await sendTransaction(
          {
            to: predictionMarketContract.address,
            data,
            value: BigInt(0),
          },
          {
            sponsor: true, // 启用 gas sponsorship
            uiOptions: {
              description: 'Claim your creator fees from the prediction market.',
              buttonText: 'Claim Creator Fees',
              showWalletUIs: true,
              transactionInfo: {
                action: 'Claim Creator Fees',
                contractInfo: {
                  name: 'Prediction Market',
                },
              },
              successHeader: 'Claim Successful!',
              successDescription: 'Your creator fees have been transferred to your wallet.',
            },
          },
        );

        console.log('领取成功! Transaction hash:', txResult.hash);
        setCurrentStep('success');
        params.onSuccess?.();
      } catch (err) {
        console.error('=== 领取创建者费用失败 ===');
        console.error('Error:', err);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setCurrentStep('error');
        params.onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [sendTransaction],
  );

  return {
    claimCreatorFees,
    isPending,
    currentStep,
    error,
  };
}
