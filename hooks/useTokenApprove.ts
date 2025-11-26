// /**
//  * Token Approve Hook
//  * 授权合约使用用户的 token
//  * 使用 Privy 的 gas sponsorship（客户端直接调用）
//  */

// import { useCallback, useState } from 'react';
// import { useSendTransaction } from '@privy-io/react-auth';
// import { encodeFunctionData } from 'viem';

// import { tokenContract } from '@/lib/contracts/predictionMarket';

// /**
//  * Token Approve Hook
//  * 用于授权合约使用用户的 token
//  */
// export function useTokenApprove() {
//   const { sendTransaction } = useSendTransaction();
//   const [isPending, setIsPending] = useState(false);
//   const [error, setError] = useState<Error | null>(null);
//   const [txHash, setTxHash] = useState<string | null>(null);

//   /**
//    * Approve 操作
//    */
//   const approve = useCallback(
//     async (spender: string, amount: bigint) => {
//       try {
//         setIsPending(true);
//         setError(null);
//         setTxHash(null);

//         console.log('=== Approve 调用参数 ===');
//         console.log('Spender:', spender);
//         console.log('Amount:', amount.toString());
//         console.log('Amount (ETH):', Number(amount) / 1e18);

//         // 验证参数
//         if (
//           !spender ||
//           spender === '0x0000000000000000000000000000000000000000'
//         ) {
//           throw new Error('Invalid spender address');
//         }

//         if (amount <= BigInt(0)) {
//           throw new Error('Invalid amount');
//         }

//         // 编码 approve 调用数据
//         const data = encodeFunctionData({
//           abi: tokenContract.abi,
//           functionName: 'approve',
//           args: [spender as `0x${string}`, amount],
//         });

//         // 使用 Privy 的 sendTransaction 并启用 gas sponsorship
//         const result = await sendTransaction(
//           {
//             to: tokenContract.address,
//             data,
//             value: BigInt(0),
//           },
//           {
//             sponsor: true, // 启用 gas sponsorship
//             uiOptions: {
//               description: 'This transaction is sponsored by Nextmate. No gas fee required.',
//               buttonText: 'Approve',
//               transactionInfo: {
//                 action: 'Approve Token',
//                 contractInfo: {
//                   name: 'USDC Token',
//                 },
//               },
//               successHeader: 'Approval Successful!',
//               successDescription: 'You can now proceed with your transaction.',
//             },
//           },
//         );

//         console.log('=== Approve 成功 ===');
//         console.log('Transaction hash:', result.hash);
//         setTxHash(result.hash);
//       } catch (err) {
//         console.error('=== Approve 失败 ===');
//         console.error('Error:', err);
//         const error = err instanceof Error ? err : new Error(String(err));
//         setError(error);
//         throw error;
//       } finally {
//         setIsPending(false);
//       }
//     },
//     [sendTransaction],
//   );

//   return {
//     approve,
//     isPending,
//     error,
//     data: txHash,
//   };
// }
