/**
 * 领取测试 Token Hook
 * 调用合约的 claim() 方法领取测试代币
 * 使用 Privy 的 gas sponsorship（客户端直接调用）
 */

import { useCallback, useState } from 'react';
import { useSendTransaction } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';

import { faucetContract } from '@/lib/contracts/predictionMarket';

export interface ClaimTokenOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 领取测试 Token
 * 可以重复调用
 */
export function useTokenClaim() {
  const { sendTransaction } = useSendTransaction();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const claim = useCallback(
    async (options?: ClaimTokenOptions) => {
      try {
        setIsPending(true);
        setError(null);

        // 编码合约调用数据
        const data = encodeFunctionData({
          abi: faucetContract.abi,
          functionName: 'claim',
        });

        console.log('=== 开始领取 Token ===');
        console.log('Faucet address:', faucetContract.address);

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
              successDescription: 'You have successfully claimed 1000 test tokens.',
            },
          },
        );

        console.log('领取成功! Transaction hash:', txHash);
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
    [sendTransaction],
  );

  return {
    claim,
    isPending,
    error,
  };
}
