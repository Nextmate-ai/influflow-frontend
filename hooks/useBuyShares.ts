/**
 * 购买份额 Hook
 * 包含 approve 和 buyShares 的完整流程
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
import { useActiveWallet, useSendBatchTransaction } from 'thirdweb/react';

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
 * 购买份额的参数
 */
export interface BuySharesParams {
  marketId: bigint; // 市场 ID
  side: number; // 1 = Yes, 2 = No
  amount: bigint; // 购买金额（wei）
}

/**
 * 购买份额 Hook
 * 使用 EIP-7702 账户抽象批量交易
 */
export function useBuyShares() {
  const {
    mutate: sendBatchTransaction,
    isPending,
    error,
  } = useSendBatchTransaction();
  const wallet = useActiveWallet();
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');

  /**
   * 批量购买份额
   * 同时执行 approve 和 buyShares 两笔交易
   * 用户只需签名一次，两笔交易原子性执行
   */
  const buySharesWithApproval = useMemo(
    () =>
      (params: BuySharesParams): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (!wallet) {
            reject(new Error('Wallet not connected'));
            return;
          }

          setCurrentStep('processing');

          // 准备批量交易数组
          const transactions = [
            // 第一笔:Approve
            prepareContractCall({
              contract: tokenContract,
              method:
                'function approve(address spender, uint256 amount) returns (bool)',
              params: [PREDICTION_MARKET_CONTRACT_ADDRESS, params.amount],
            }),
            // 第二笔:BuyShares
            prepareContractCall({
              contract: predictionMarketContract,
              method:
                'function buyShares(uint256 marketId, uint8 side, uint256 amount) returns (uint256 shares)',
              params: [params.marketId, params.side, params.amount],
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
    buySharesWithApproval,
    isPending,
    currentStep,
    error,
  };
}
