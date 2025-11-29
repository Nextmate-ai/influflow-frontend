/**
 * 创建市场 Hook
 * 包含 approve 和 createMarket 的完整流程
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
 * 创建市场的参数
 */
export interface CreateMarketParams {
  questionTitle: string;
  questionDescription: string;
  endTime: bigint; // Unix 时间戳（秒）
  creatorSide: 1 | 2; // 创建者选择的立场：1 = Yes, 2 = No
  creatorBet: bigint; // 创建者投注金额（wei）
}

/**
 * 创建市场 Hook
 * 序列化执行 approve 和 createMarket 两笔交易
 */
export function useMarketCreation() {
  const { sendTransaction } = useSendTransaction();
  const { wallets } = useWallets();
  const [isPending, setIsPending] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'approving' | 'waiting_approval' | 'creating' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<Error | null>(null);

  /**
   * 创建市场（包含 approve）
   * 序列化执行两笔交易
   */
  const createMarketWithApproval = useCallback(
    async (params: CreateMarketParams): Promise<void> => {
      try {
        setIsPending(true);
        setError(null);
        setCurrentStep('approving');

        console.log('=== 开始创建市场流程 ===');
        console.log('Title:', params.questionTitle);
        console.log('Description:', params.questionDescription);
        console.log('End Time:', params.endTime.toString());
        console.log('Creator Side:', params.creatorSide);
        console.log('Creator Bet:', params.creatorBet.toString());

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
        console.log('需要金额:', params.creatorBet.toString());

        if (balance < params.creatorBet) {
          throw new Error(
            `Insufficient balance. Required: ${(Number(params.creatorBet) / 1e18).toFixed(2)}, Current: ${(Number(balance) / 1e18).toFixed(2)}`,
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
        if (currentAllowance < params.creatorBet) {
          console.log('步骤 1/2: 授权 Token...');

          // 编码 approve 调用数据（无限授权）
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
                  'Before creating a market, you need to authorize the contract.',
                buttonText: 'Approve',
                transactionInfo: {
                  action: 'Approve Token',
                  contractInfo: {
                    name: 'USDC Token',
                  },
                },
                successHeader: 'Approval Successful!',
                successDescription: 'Now proceeding to create market...',
              },
            },
          );

          console.log('授权交易已发送! Transaction hash:', approveTxResult.hash);
          console.log('授权完成，继续创建市场!');
        } else {
          console.log('授权额度充足，跳过 approve 步骤');
        }

        // 第二步: Create Market
        setCurrentStep('creating');
        console.log('步骤 2/2: 创建市场...');

        // 编码 createMarket 调用数据
        const createMarketData = encodeFunctionData({
          abi: predictionMarketContract.abi,
          functionName: 'createMarket',
          args: [
            params.questionTitle,
            params.questionDescription,
            params.endTime,
            params.creatorSide,
            params.creatorBet,
          ],
        });

        // 使用 Privy 的 sendTransaction 并启用 gas sponsorship
        const createMarketTxResult = await sendTransaction(
          {
            to: predictionMarketContract.address,
            data: createMarketData,
            value: BigInt(0),
          },
          {
            sponsor: true, // 启用 gas sponsorship
            uiOptions: {
              description: 'Create a new market.',
              buttonText: 'Create Market',
              transactionInfo: {
                action: 'Create Market',
                contractInfo: {
                  name: 'Prediction Market',
                },
              },
              successHeader: 'Market Created Successfully!',
              successDescription: 'Your prediction market is now live.',
            },
          },
        );

        console.log('市场创建成功! Transaction hash:', createMarketTxResult.hash);
        setCurrentStep('success');
      } catch (err) {
        console.error('=== 创建市场失败 ===');
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
    createMarketWithApproval,
    isPending,
    currentStep,
    error,
  };
}
