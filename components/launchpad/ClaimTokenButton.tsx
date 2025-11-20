'use client';

import { useActiveWallet } from 'thirdweb/react';

import { addToast } from '@/components/base/toast';
import { useTokenClaim } from '@/hooks/useTokenClaim';

/**
 * 领取测试 Token 按钮组件
 * 仅在钱包连接后显示
 */
export function ClaimTokenButton() {
  const wallet = useActiveWallet();
  const { claim, isPending } = useTokenClaim();

  // 如果钱包未连接，不显示按钮
  if (!wallet) {
    return null;
  }

  const handleClaim = () => {
    claim({
      onSuccess: () => {
        addToast({
          title: 'Success',
          description: '1000 Test tokens claimed successfully!',
          color: 'success',
        });
      },
      onError: (error) => {
        addToast({
          title: 'Failed',
          description: 'Failed to claim test tokens. Each address can only claim once per day.',
          color: 'danger',
        });
      },
    });
  };

  return (
    <button
      onClick={handleClaim}
      disabled={isPending}
      className="rounded-lg bg-gradient-to-r from-[#D245C3] to-[#5731AC] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? 'Claiming...' : 'Faucet'}
    </button>
  );
}

