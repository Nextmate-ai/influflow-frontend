/**
 * 购买份额 Hook
 * 包含 approve 和 buyShares 的完整流程
 * 使用 Privy 的 gas sponsorship（客户端直接调用）
 */

import { useCallback, useState } from 'react';
import { useSendTransaction, useWallets } from '@privy-io/react-auth';
import { createPublicClient, encodeFunctionData, http } from 'viem';
import { baseSepolia } from 'viem/chains';

import {
  predictionMarketContract,
  tokenContract,
} from '@/lib/contracts/predictionMarket';
import { PREDICTION_MARKET_CONTRACT_ADDRESS } from '@/constants/env';

// 创建 public client 用于读取合约状态
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

/**
 * 购买份额的参数
 */
export interface BuySharesParams {
  marketId: bigint; // 市场 ID
  side: 1 | 2; // 1 = Yes, 2 = No
  amount: bigint; // 购买金额（wei）
}

/**
 * 购买份额 Hook
 * 序列化执行 approve 和 buyShares 两笔交易
 */
export function useBuyShares() {
  const { sendTransaction } = useSendTransaction();
  const { wallets } = useWallets();
  const [isPending, setIsPending] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'approving' | 'buying' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<Error | null>(null);
  const [approveAmount, setApproveAmount] = useState<string>('');

  /**
   * 购买份额（包含 approve）
   * 序列化执行两笔交易
   */
  const buySharesWithApproval = useCallback(
    async (params: BuySharesParams): Promise<void> => {
      try {
        setIsPending(true);
        setError(null);
        setCurrentStep('approving');

        console.log('=== 开始购买份额流程 ===');
        console.log('Market ID:', params.marketId.toString());
        console.log('Side:', params.side);
        console.log('Amount:', params.amount.toString());

        // 获取当前钱包地址
        const wallet = wallets.find((w) => w.walletClientType === 'privy');
        if (!wallet || !wallet.address) {
          throw new Error('Wallet address not found');
        }
        const userAddress = wallet.address as `0x${string}`;
        console.log('用户地址:', userAddress);

        // 检查余额
        const balance = await publicClient.readContract({
          address: tokenContract.address,
          abi: tokenContract.abi,
          functionName: 'balanceOf',
          args: [userAddress],
        });
        console.log('Token 余额:', balance.toString());
        console.log('需要金额:', params.amount.toString());

        if (balance < params.amount) {
          throw new Error(
            `Insufficient balance. Required: ${(Number(params.amount) / 1e18).toFixed(2)}, Current: ${(Number(balance) / 1e18).toFixed(2)}`,
          );
        }

        // 检查当前授权额度
        const currentAllowance = await publicClient.readContract({
          address: tokenContract.address,
          abi: tokenContract.abi,
          functionName: 'allowance',
          args: [userAddress, PREDICTION_MARKET_CONTRACT_ADDRESS as `0x${string}`],
        });
        console.log('当前授权额度:', currentAllowance.toString());

        // 第一步: Approve（仅当授权额度不足时）
        if (currentAllowance < params.amount) {
          console.log('步骤 1/2: 授权 Token...');

          // 记录授权金额用于显示
          const amountInTokens = (Number(params.amount) / 1e18).toFixed(2);
          setApproveAmount(amountInTokens);

          // 编码 approve 调用数据
          const approveData = encodeFunctionData({
            abi: tokenContract.abi,
            functionName: 'approve',
            args: [
              PREDICTION_MARKET_CONTRACT_ADDRESS as `0x${string}`,
              BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), // 无限授权
            ],
          });

          // 使用 Privy 的 sendTransaction 并启用 gas sponsorship
          const approveTxResult = await sendTransaction(
            {
              to: tokenContract.address,
              data: approveData,
              value: BigInt(0),
            },
            {
              sponsor: true, // 启用 gas sponsorship
              uiOptions: {
                description:
                  'Before buying shares, you need to authorize the contract.',
                buttonText: 'Approve',
                showWalletUIs: false,
                transactionInfo: {
                  action: 'Approve Token',
                  contractInfo: {
                    name: 'USDC Token',
                  },
                },
                successHeader: 'Approval Successful!',
                successDescription: 'Now proceeding to buy shares...',
              },
            },
          );

          console.log('授权交易已发送! Transaction hash:', approveTxResult.hash);
          console.log('授权完成，继续购买流程!');
        } else {
          console.log('授权额度充足，跳过 approve 步骤');
        }

        // 第二步: Buy Shares
        setCurrentStep('buying');
        console.log('步骤 2/2: 购买份额...');

        // 编码 buyShares 调用数据
        const buySharesData = encodeFunctionData({
          abi: predictionMarketContract.abi,
          functionName: 'buyShares',
          args: [params.marketId, params.side, params.amount],
        });

        // 使用 Privy 的 sendTransaction 并启用 gas sponsorship
        const buySharesTxResult = await sendTransaction(
          {
            to: predictionMarketContract.address,
            data: buySharesData,
            value: BigInt(0),
          },
          {
            sponsor: true, // 启用 gas sponsorship
            uiOptions: {
              description:
                'Buy shares of the selected side',
              buttonText: 'Buy Shares',
              showWalletUIs: false,
              transactionInfo: {
                action: 'Buy Shares',
                contractInfo: {
                  name: 'Prediction Market',
                },
              },
              successHeader: 'Purchase Successful!',
              successDescription: 'Your shares have been purchased successfully.',
            },
          },
        );

        console.log('购买成功! Transaction hash:', buySharesTxResult.hash);
        setCurrentStep('success');
      } catch (err) {
        console.error('=== 购买份额失败 ===');
        console.error('Error:', err);
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
    buySharesWithApproval,
    isPending,
    currentStep,
    error,
    approveAmount,
  };
}
