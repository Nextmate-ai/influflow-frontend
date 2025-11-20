'use client';

import { useEffect, useRef, useState } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { ConnectButton, useActiveWallet } from 'thirdweb/react';
import { inAppWallet } from 'thirdweb/wallets';

import { UserProfileModal } from '@/components/modals/UserProfileModal';
import { THIRDWEB_CLIENT_ID, TOKEN_CONTRACT_ADDRESS } from '@/constants/env';
import { useTokenApprove } from '@/hooks/useTokenApprove';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenClaim } from '@/hooks/useTokenClaim';

import { WalletUserInfo } from './WalletUserInfo';

interface WalletConnectInnerProps {
  onParticipationsClick?: () => void;
  onCreationsClick?: () => void;
}

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
      sponsorGas: true,
    },
  }),
];

/**
 * ConnectButton 包装组件
 * 注意：ThirdwebProvider 和 QueryClientProvider 现在在页面级别提供
 */
export function WalletConnectInner({
  onParticipationsClick,
  onCreationsClick,
}: WalletConnectInnerProps) {
  const wallet = useActiveWallet();
  const connectButtonRef = useRef<HTMLDivElement>(null);
  const customButtonRef = useRef<HTMLButtonElement>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 当组件挂载后，查找 ConnectButton 渲染的按钮并设置点击处理器
  useEffect(() => {
    if (!wallet && connectButtonRef.current && customButtonRef.current) {
      const findConnectButton = () => {
        const buttons = connectButtonRef.current?.querySelectorAll('button');
        if (buttons && buttons.length > 0) {
          // 找到 ConnectButton 渲染的按钮（通常是第一个）
          const connectButton = Array.from(buttons).find(
            (btn) => btn !== customButtonRef.current,
          );
          if (connectButton && customButtonRef.current) {
            // 设置自定义按钮的点击处理器
            const handleClick = () => {
              connectButton.click();
            };
            customButtonRef.current.onclick = handleClick;
            return () => {
              if (customButtonRef.current) {
                customButtonRef.current.onclick = null;
              }
            };
          }
        }
        return undefined;
      };

      // 延迟查找，确保 ConnectButton 已经渲染
      const timer = setTimeout(findConnectButton, 100);
      return () => clearTimeout(timer);
    }
  }, [wallet]);

  const handleUserClick = () => {
    if (wallet) {
      setIsProfileModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {wallet ? (
          // 已登录：显示钱包用户信息
          <>
            <WalletUserInfo onClick={handleUserClick} />
            {/* 领取测试 Token 按钮 - 仅在钱包连接后显示 */}
            {/* <ClaimTokenButton /> */}
            {/* Approve 按钮 - 仅在钱包连接后显示 */}
            {/* <ApproveButton /> */}
          </>
        ) : (
          // 未登录：显示与 SharedHeader Login 按钮样式一致的连接按钮
          <div className="relative mr-3 inline-block">
            {/* ConnectButton - 隐藏但保持功能 */}
            <div
              ref={connectButtonRef}
              className="[&_button]:!absolute [&_button]:!inset-0 [&_button]:!z-10 [&_button]:!h-full [&_button]:!w-full [&_button]:!opacity-0"
            >
              <ConnectButton
                accountAbstraction={{
                  chain: baseSepolia, // 使用 Base Sepolia 测试网
                  sponsorGas: true, // 启用 gas 赞助（免 gas 交易）
                }}
                client={client}
                connectModal={{ size: 'compact' }}
                theme="dark"
                wallets={wallets}
                connectButton={{
                  label: 'Connect',
                }}
                detailsButton={{
                  displayBalanceToken: {
                    [baseSepolia.id]: TOKEN_CONTRACT_ADDRESS,
                  },
                }}
              />
            </div>
            {/* 自定义按钮覆盖层 - 青色主题风格 */}
            <button
              ref={customButtonRef}
              type="button"
              className="flex h-[40px] cursor-pointer items-center justify-center rounded-[8px] border-2 border-[#2DC3D9] bg-transparent px-6 font-medium text-[#2DC3D9] transition-all duration-200 hover:bg-[#2DC3D9]/10"
            >
              Connect
            </button>
          </div>
        )}
      </div>

      {/* 用户详情弹窗 */}
      {wallet && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onParticipationsClick={onParticipationsClick}
          onCreationsClick={onCreationsClick}
        />
      )}
    </>
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
      className="rounded-lg bg-gradient-to-r from-[#D245C3] to-[#5731AC] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
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
        className="rounded-lg bg-gradient-to-r from-[#1FA2FF] to-[#12D8FA] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? '授权中...' : 'Approve'}
      </button>
      {!isLoadingBalance && (
        <span className="text-xs text-gray-400">
          余额: {(Number(balance) / 1e18).toFixed(4)} tokens
        </span>
      )}
      {error && (
        <span className="max-w-[200px] text-right text-xs text-red-400">
          错误: {error.message}
        </span>
      )}
    </div>
  );
}
