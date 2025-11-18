/**
 * 创建市场 Hook
 * 包含 approve 和 createMarket 的完整流程
 */

import { useSendTransaction, useActiveWallet } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { useMemo, useState } from 'react';
import { predictionMarketContract } from '@/lib/contracts/predictionMarket';

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
  const wallet = useActiveWallet();
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'approving' | 'creating' | 'success' | 'error'
  >('idle');

  /**
   * Approve 操作
   * 授权合约使用用户的 token
   */
  const approve = useMemo(
    () => (spender: string, amount: bigint) => {
      setCurrentStep('approving');
      const transaction = prepareContractCall({
        contract: predictionMarketContract,
        method: 'function approve(address spender, uint256 amount) returns (bool)',
        params: [spender, amount],
      });
      sendTransaction(transaction, {
        onSuccess: () => {
          setCurrentStep('idle');
        },
        onError: () => {
          setCurrentStep('error');
        },
      });
    },
    [sendTransaction],
  );

  /**
   * 创建市场
   */
  const createMarket = useMemo(
    () => (params: CreateMarketParams) => {
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
        },
        onError: () => {
          setCurrentStep('error');
        },
      });
    },
    [sendTransaction],
  );

  /**
   * 完整的创建流程
   * 先 approve，然后创建市场
   */
  const createMarketWithApproval = useMemo(
    () => async (params: CreateMarketParams, tokenAddress: string) => {
      if (!wallet) {
        throw new Error('Wallet not connected');
      }

      try {
        // 第一步：Approve
        setCurrentStep('approving');
        await new Promise<void>((resolve, reject) => {
          approve(tokenAddress, params.creatorBet);
          // 这里需要等待 approve 完成
          // 由于 useSendTransaction 是异步的，我们需要通过回调来处理
          // 实际实现中可能需要使用 Promise 包装
          setTimeout(() => {
            resolve();
          }, 2000); // 临时方案，实际应该等待交易确认
        });

        // 第二步：创建市场
        setCurrentStep('creating');
        createMarket(params);
      } catch (err) {
        setCurrentStep('error');
        throw err;
      }
    },
    [wallet, approve, createMarket],
  );

  return {
    approve,
    createMarket,
    createMarketWithApproval,
    isPending,
    currentStep,
    error,
  };
}

