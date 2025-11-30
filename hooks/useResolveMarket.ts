/**
 * Resolve Market Hook
 * 用于解决预测市场结果
 * 仅在测试环境使用
 */

import { useCallback, useState } from 'react';
import { useSendTransaction, useWallets } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';

import { predictionMarketContract } from '@/lib/contracts/predictionMarket';

/**
 * Resolve 市场的参数
 */
export interface ResolveMarketParams {
  marketId: bigint; // 市场 ID
  outcome: 0 | 1 | 2; // 0 = Void (流局), 1 = Yes, 2 = No
}

/**
 * Resolve Market Hook
 * 调用合约的 resolveMarket 方法
 */
export function useResolveMarket() {
  const { sendTransaction } = useSendTransaction();
  const { wallets } = useWallets();
  const [isPending, setIsPending] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'resolving' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<Error | null>(null);

  /**
   * Resolve 市场
   */
  const resolveMarket = useCallback(
    async (params: ResolveMarketParams): Promise<void> => {
      try {
        setIsPending(true);
        setError(null);
        setCurrentStep('resolving');

        console.log('Starting Market Resolution. Market ID:', params.marketId.toString(), 'Outcome:', params.outcome);

        // 获取当前钱包地址
        const wallet = wallets.find((w) => w.walletClientType === 'privy');
        if (!wallet || !wallet.address) {
          throw new Error('Wallet address not found');
        }

        // 编码 resolveMarket 调用数据
        const resolveData = encodeFunctionData({
          abi: predictionMarketContract.abi,
          functionName: 'resolveMarket',
          args: [params.marketId, params.outcome],
        });

        // 使用 Privy 的 sendTransaction 并启用 gas sponsorship
        const outcomeText = params.outcome === 0 ? 'Void' : params.outcome === 1 ? 'Yes' : 'No';
        const resolveTxResult = await sendTransaction(
          {
            to: predictionMarketContract.address,
            data: resolveData,
            value: BigInt(0),
          },
          {
            sponsor: true, // 启用 gas sponsorship
            uiOptions: {
              description: `Resolve market with outcome: ${outcomeText}`,
              buttonText: 'Resolve Market',
              transactionInfo: {
                action: 'Resolve Market',
                contractInfo: {
                  name: 'Prediction Market',
                },
              },
              successHeader: 'Market Resolved!',
              successDescription: 'The market has been resolved successfully.',
            },
          },
        );

        console.log('Resolve successfully! Transaction hash:', resolveTxResult.hash);
        setCurrentStep('success');
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setCurrentStep('error');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [sendTransaction, wallets],
  );

  return {
    resolveMarket,
    isPending,
    currentStep,
    error,
  };
}
