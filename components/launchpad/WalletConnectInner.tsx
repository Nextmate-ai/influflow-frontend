'use client';

import { createThirdwebClient } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { ConnectButton, useActiveWallet } from 'thirdweb/react';
import { inAppWallet } from 'thirdweb/wallets';

import { THIRDWEB_CLIENT_ID } from '@/constants/env';
import { useTokenApprove } from '@/hooks/useTokenApprove';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenClaim } from '@/hooks/useTokenClaim';

// 创建 Thirdweb 客户端
const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

// 配置只使用 In-App Wallet，只支持 X 登录
const wallets = [
  inAppWallet({
    auth: {
      options: ['x'],
    },
    executionMode: {
      mode: 'EIP7702',
      sponsorGas: false,
    },
  }),
];

/**
 * ConnectButton 包装组件
 * 注意：ThirdwebProvider 和 QueryClientProvider 现在在页面级别提供
 */
export function WalletConnectInner() {
  return (
    <div className="flex items-center gap-3">
      <ConnectButton
        accountAbstraction={{
          chain: baseSepolia, // 使用 Base Sepolia 测试网
          sponsorGas: false, // 启用 gas 赞助（免 gas 交易）
        }}
        client={client}
        connectModal={{ size: 'compact' }}
        theme="dark"
        wallets={wallets}
        connectButton={{
          label: '使用 X 登录',
        }}
      />
      {/* 领取测试 Token 按钮 - 仅在钱包连接后显示 */}
      <ClaimTokenButton />
      {/* Approve 按钮 - 仅在钱包连接后显示 */}
      <ApproveButton />
    </div>
  );
}

/**
 * 领取测试 Token 按钮组件
 * 仅在钱包连接后显示
 */
function ClaimTokenButton() {
  const wallet = useActiveWallet();
  const { claim, isPending, error } = useTokenClaim();

  // 如果钱包未连接，不显示按钮
  if (!wallet) {
    return null;
  }

  return (
    <button
      onClick={claim}
      disabled={isPending}
      className="px-4 py-2 bg-gradient-to-r from-[#D245C3] to-[#5731AC] text-white font-semibold rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      {isPending ? '领取中...' : '领取测试 Token'}
    </button>
  );
}

/**
 * Approve 按钮组件
 * 仅在钱包连接后显示
 * 用于授权合约使用用户的 token
 */
function ApproveButton() {
  const wallet = useActiveWallet();
  const { approve, isPending, error } = useTokenApprove();
  const { balance, isLoading: isLoadingBalance } = useTokenBalance();

  // 如果钱包未连接，不显示按钮
  if (!wallet) {
    return null;
  }

  // 固定的 approve 参数
  const spender = '0x04564470C8ee36dd24852E8837C97c4b12E507B8';

  const amount = BigInt('2000000000000000000'); // 1 ETH in wei

  const handleApprove = () => {
    console.log('=== Approve Button Clicked ===');
    console.log('User balance:', balance.toString());
    console.log('Amount to approve:', amount.toString());
    approve(spender, BigInt('300000000000000000000'));
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleApprove}
        disabled={isPending || isLoadingBalance}
        className="px-4 py-2 bg-gradient-to-r from-[#1FA2FF] to-[#12D8FA] text-white font-semibold rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isPending ? '授权中...' : 'Approve'}
      </button>
      {!isLoadingBalance && (
        <span className="text-xs text-gray-400">
          余额: {(Number(balance) / 1e18).toFixed(4)} tokens
        </span>
      )}
      {error && (
        <span className="text-xs text-red-400 max-w-[200px] text-right">
          错误: {error.message}
        </span>
      )}
    </div>
  );
}
