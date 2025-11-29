/**
 * 领取测试 Token Hook
 * 调用合约的 claim() 方法领取测试代币
 * 使用 Privy 的 gas sponsorship（客户端直接调用）
 */

import { useCallback, useState } from 'react';
import { useSendTransaction, useWallets } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';
import { usePublicClient } from 'wagmi';

import { faucetContract } from '@/lib/contracts/predictionMarket';

export interface ClaimTokenOptions {
  onSuccess?: () => void;
  onError?: (error: Error, waitTime?: number) => void;
}

/**
 * 将秒数转换为友好的时间描述
 */
function formatWaitTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours} hours ${minutes} minutes`;
  } else if (minutes > 0) {
    return `${minutes} minutes ${secs} seconds`;
  } else {
    return `${secs} seconds`;
  }
}

/**
 * 领取测试 Token
 * 可以重复调用
 */
export function useTokenClaim() {
  const { sendTransaction } = useSendTransaction();
  const { wallets } = useWallets();
  const publicClient = usePublicClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const claim = useCallback(
    async (options?: ClaimTokenOptions) => {
      try {
        setIsPending(true);
        setError(null);

        // 获取当前钱包地址
        const address = wallets[0]?.address;
        if (!address) {
          throw new Error('Please connect your wallet first');
        }

        if (!publicClient) {
          throw new Error('Public client not initialized');
        }

        // 检查距离下次可领取还有多少秒
        const waitTime = await publicClient.readContract({
          address: faucetContract.address,
          abi: faucetContract.abi,
          functionName: 'getTimeUntilNextClaim',
          args: [address as `0x${string}`],
        });

        const waitTimeNumber = Number(waitTime);

        // 如果需要等待（waitTime > 0），则不能领取
        if (waitTimeNumber > 0) {
          const waitTimeFormatted = formatWaitTime(waitTimeNumber);
          const errorMessage = `Each address can only claim once per 24 hours. Please try again in ${waitTimeFormatted}.`;
          const error = new Error(errorMessage);
          setError(error);
          options?.onError?.(error, waitTimeNumber);
          return;
        }

        // 编码合约调用数据
        const data = encodeFunctionData({
          abi: faucetContract.abi,
          functionName: 'claim',
        });


        // 使用 Privy 的 sendTransaction 并启用 gas sponsorship
        const txHash = await sendTransaction(
          {
            to: faucetContract.address as `0x${string}`,
            data,
            value: BigInt(0),
          },
          {
            sponsor: true, // 启用 gas sponsorship
            uiOptions: {
              description:
                'Claim test tokens from the faucet. Each address can claim 10000 tokens per day.',
              buttonText: 'Claim Tokens',
              transactionInfo: {
                action: 'Claim Tokens',
                contractInfo: {
                  name: 'Token Faucet',
                },
              },
              successHeader: 'Claim Successful!',
              successDescription: 'You have successfully claimed 10000 test tokens.',
            },
          },
        );

        options?.onSuccess?.();
      } catch (err) {
        console.error('=== 领取 Token 失败 ===');
        console.error('Error:', err);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options?.onError?.(error);
      } finally {
        setIsPending(false);
      }
    },
    [sendTransaction, wallets, publicClient],
  );

  return {
    claim,
    isPending,
    error,
  };
}
