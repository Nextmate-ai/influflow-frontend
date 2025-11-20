/**
 * 创建市场 Hook
 * 包含 approve 和 createMarket 的完整流程
 */

import {
  PREDICTION_MARKET_CONTRACT_ADDRESS,
  THIRDWEB_CLIENT_ID,
  TOKEN_CONTRACT_ADDRESS,
} from '@/constants/env';
import { predictionMarketContract } from '@/lib/contracts/predictionMarket';
import { useMemo, useState } from 'react';
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
} from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import {
  useActiveWallet,
  useSendBatchTransaction,
  useSendTransaction,
} from 'thirdweb/react';

// 创建 Thirdweb 客户端
const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

// 创建 Token 合约实例
const tokenContract = getContract({
  client,
  chain: baseSepolia,
  address: TOKEN_CONTRACT_ADDRESS,
});

/**
 * 创建市场的参数
 */
export interface CreateMarketParams {
  questionTitle: string;
  questionDescription: string;
  endTime: bigint; // Unix 时间戳（秒）
  creatorSide: number; // 0 = Yes, 1 = No
  creatorBet: bigint; // 创建者的投注金额（wei）
}

/**
 * 创建市场 Hook
 * 流程：先 approve，再 createMarket
 */
export function useMarketCreation() {
  const { mutate: sendTransaction, isPending, error } = useSendTransaction();
  const {
    mutate: sendBatchTransaction,
    isPending: isBatchPending,
    error: batchError,
  } = useSendBatchTransaction();
  const wallet = useActiveWallet();
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'approving' | 'creating' | 'success' | 'error'
  >('idle');

  /**
   * Approve 操作
   * 授权合约使用用户的 token
   * 注意：approve 应该在 token 合约上调用，spender 是市场合约地址
   * @returns Promise<void> 当交易成功时 resolve，失败时 reject
   */
  const approve = useMemo(
    () =>
      (amount: bigint): Promise<void> => {
        return new Promise((resolve, reject) => {
          setCurrentStep('approving');
          const transaction = prepareContractCall({
            contract: tokenContract, // 使用 token 合约，而不是市场合约
            method:
              'function approve(address spender, uint256 amount) returns (bool)',
            params: [PREDICTION_MARKET_CONTRACT_ADDRESS, amount], // spender 是市场合约地址
          });
          sendTransaction(transaction, {
            onSuccess: () => {
              setCurrentStep('idle');
              resolve();
            },
            onError: (error) => {
              setCurrentStep('error');
              reject(error);
            },
          });
        });
      },
    [sendTransaction],
  );

  /**
   * 创建市场
   * @returns Promise<void> 当交易成功时 resolve，失败时 reject
   */
  const createMarket = useMemo(
    () =>
      (params: CreateMarketParams): Promise<void> => {
        return new Promise((resolve, reject) => {
          setCurrentStep('creating');
          const transaction = prepareContractCall({
            contract: predictionMarketContract,
            method:
              'function createMarket(string questionTitle, string questionDescription, uint256 endTime, uint8 creatorSide, uint256 creatorBet) returns (uint256 marketId)',
            params: [
              params.questionTitle,
              params.questionDescription,
              params.endTime,
              params.creatorSide,
              params.creatorBet,
            ],
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
    [sendTransaction],
  );

  /**
   * 完整的创建流程(批量交易版本)
   * 使用 EIP-7702 账户抽象,批量发送 approve 和 createMarket 两笔交易
   * 用户只需签名一次,两笔交易原子性执行
   */
  const createMarketWithApproval = useMemo(
    () =>
      (params: CreateMarketParams): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (!wallet) {
            reject(new Error('Wallet not connected'));
            return;
          }

          setCurrentStep('creating'); // 批量交易直接设置为 creating 状态

          // 准备批量交易数组
          const transactions = [
            // 第一笔:Approve
            prepareContractCall({
              contract: tokenContract,
              method:
                'function approve(address spender, uint256 amount) returns (bool)',
              params: [PREDICTION_MARKET_CONTRACT_ADDRESS, params.creatorBet],
            }),
            // 第二笔:CreateMarket
            prepareContractCall({
              contract: predictionMarketContract,
              method:
                'function createMarket(string questionTitle, string questionDescription, uint256 endTime, uint8 creatorSide, uint256 creatorBet) returns (uint256 marketId)',
              params: [
                params.questionTitle,
                params.questionDescription,
                params.endTime,
                params.creatorSide,
                params.creatorBet,
              ],
            }),
          ];

          // 使用批量交易发送
          sendBatchTransaction(transactions, {
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
    [wallet, sendBatchTransaction],
  );

  return {
    approve,
    createMarket,
    createMarketWithApproval,
    isPending: isPending || isBatchPending,
    currentStep,
    error: error || batchError,
  };
}
