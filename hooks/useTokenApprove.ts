/**
 * Token Approve Hook
 * 授权合约使用用户的 token
 */

import { useMemo } from 'react';
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
} from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { useActiveWallet, useSendTransaction } from 'thirdweb/react';

import { THIRDWEB_CLIENT_ID } from '@/constants/env';

// Token 合约地址
const TOKEN_CONTRACT_ADDRESS = '0xC5387F42883F6AfBa3AA935764Ac79a112aE1897';

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
 * Token Approve 参数
 */
export interface ApproveParams {
  spender: string; // 被授权的地址
  amount: bigint; // 授权金额（wei）
}

/**
 * Token Approve Hook
 * 用于授权合约使用用户的 token
 */
export function useTokenApprove() {
  const wallet = useActiveWallet();
  // 禁用 payModal 以确保显示签名弹窗
  const { mutate: sendTransaction, isPending, error } = useSendTransaction({});

  /**
   * Approve 操作
   * 注意：这里需要调用 token 合约的 approve 方法，而不是市场合约
   * 当前使用市场合约地址作为临时值，需要替换为实际的 token 合约地址
   */
  const approve = useMemo(
    () => (spender: string, amount: bigint) => {
      // 打印入参
      console.log('=== Approve 调用参数 ===');
      console.log('Token Contract Address:', TOKEN_CONTRACT_ADDRESS);
      console.log('User Address:', wallet?.getAccount()?.address);
      console.log('spender:', spender);
      console.log('amount:', amount.toString());
      console.log('amount (hex):', '0x' + amount.toString(16));
      console.log('amount (ETH):', Number(amount) / 1e18);

      if (!wallet) {
        console.error('Wallet not connected');
        return;
      }

      // 验证参数
      if (
        !spender ||
        spender === '0x0000000000000000000000000000000000000000'
      ) {
        console.error('Invalid spender address');
        return;
      }

      if (amount <= BigInt(0)) {
        console.error('Invalid amount');
        return;
      }

      const transaction = prepareContractCall({
        contract: tokenContract,
        method:
          'function approve(address spender, uint256 amount) returns (bool)',
        params: [spender, amount],
      });

      console.log('Transaction prepared:', transaction);
      console.log('Transaction data:', {
        to: transaction.to,
        data: transaction.data,
        value: transaction.value,
      });
      const transactionTo =
        typeof transaction.to === 'string'
          ? transaction.to
          : typeof transaction.to === 'function'
            ? 'function'
            : String(transaction.to);
      console.log('Contract address in transaction:', transactionTo);
      if (typeof transactionTo === 'string') {
        console.log(
          'Is contract address correct?',
          transactionTo.toLowerCase() === TOKEN_CONTRACT_ADDRESS.toLowerCase(),
        );
      }

      console.log('=== 开始发送交易 ===');
      console.log('Wallet account:', wallet.getAccount());

      // 使用 useSendTransaction，禁用 payModal 以确保显示签名弹窗
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log('=== Approve 成功 ===');
          console.log('Transaction result:', result);
          console.log('Transaction hash:', result?.transactionHash);
          console.log('Full result object:', JSON.stringify(result, null, 2));

          // 尝试获取 receipt（如果存在）
          if (result && typeof result === 'object') {
            const resultAny = result as any;
            if (resultAny.receipt) {
              console.log('Receipt:', resultAny.receipt);
              console.log('Receipt status:', resultAny.receipt.status);
              console.log('Gas used:', resultAny.receipt.gasUsed?.toString());
              console.log(
                'Block number:',
                resultAny.receipt.blockNumber?.toString(),
              );
            }
          }
        },
        onError: (err) => {
          console.error('=== Approve 失败 ===');
          console.error('Error:', err);
          console.error('Error message:', err?.message);
          console.error('Error stack:', err?.stack);
        },
      });
    },
    [sendTransaction, wallet],
  );

  return {
    approve,
    isPending,
    error,
  };
}
