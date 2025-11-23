'use client';

import React, { useState } from 'react';

import { useClaimPayout } from '@/hooks/useClaimPayout';
import { useClaimCreatorFees } from '@/hooks/useClaimCreatorFees';

interface ParticipationRowProps {
  prediction: string;
  totalVolume: string;
  rewards: number;
  time: string;
  status: 'Ongoing' | 'Finished' | 'Voided' | 'Resolved';
  outcome: 'Yes' | 'No' | null;
  opinion?: 'Yes' | 'No' | null;
  viewType?: 'participations' | 'creations';
  betAmount?: number; // 用户投注金额
  expectedPayout?: number; // 预期收益
  claimed?: boolean; // 是否已领取
  marketOutcome?: 'Yes' | 'No' | null; // 市场结果
  marketState?: string; // 市场状态 (Active/Resolved 等)
  marketId?: string; // 市场 ID (用于 claim 交易)
  onClaimSuccess?: () => void; // Claim 成功回调
  creatorFeesClaimed?: boolean; // Creator 费用是否已领取
}

/**
 * 参与行组件 - 表格中的单行数据
 */
export const ParticipationRow: React.FC<ParticipationRowProps> = ({
  prediction,
  totalVolume,
  rewards,
  time,
  status,
  outcome,
  opinion,
  viewType = 'participations',
  betAmount = 0,
  expectedPayout = 0,
  claimed = false,
  marketOutcome = null,
  marketState = '',
  marketId,
  onClaimSuccess,
  creatorFeesClaimed = false,
}) => {
  const { claimPayout, isPending } = useClaimPayout();
  const { claimCreatorFees, isPending: isClaimCreatorFeesPending } =
    useClaimCreatorFees();
  const [isClaimSuccess, setIsClaimSuccess] = useState(false);

  // 处理 Claim 按钮点击（participations 视图）
  const handleClaimClick = async () => {
    if (!marketId || isPending) return;

    try {
      await claimPayout({ marketId: BigInt(marketId) });
      setIsClaimSuccess(true);
      // 调用成功回调，刷新数据
      onClaimSuccess?.();
    } catch (error) {
      console.error('Claim failed:', error);
      // 这里可以添加 toast 通知
    }
  };

  // 处理 Claim Creator Fees 按钮点击（creations 视图）
  const handleClaimCreatorFeesClick = async () => {
    if (!marketId || isClaimCreatorFeesPending) return;

    try {
      await claimCreatorFees({ marketId: BigInt(marketId) });
      // 调用成功回调，刷新数据
      onClaimSuccess?.();
    } catch (error) {
      console.error('Claim creator fees failed:', error);
      // 这里可以添加 toast 通知
    }
  };
  // 计算实际的 outcome 显示: Win/Loss/-
  const getActualOutcome = () => {
    // 如果 marketOutcome 不存在或为 null,返回 -
    if (!marketOutcome) {
      return '-';
    }
    // 如果用户投注方向和市场结果一致,返回 Win,否则返回 Loss
    if (opinion === marketOutcome) {
      return 'Win';
    }
    return 'Loss';
  };

  const actualOutcome = getActualOutcome();

  // Status 显示逻辑:
  // 1. 如果 marketState 是 'Active',显示 'Ongoing'
  // 2. 否则根据 claimed 判断:
  //    - claimed = true → 'Claimed'
  //    - claimed = false → 'Claim'
  const displayStatus =
    marketState?.toLowerCase() === 'active'
      ? 'Ongoing'
      : claimed
        ? 'Claimed'
        : 'Claim';
  // Outcome 渐变样式
  const getOutcomeStyle = () => {
    if (viewType === 'creations') {
      // creations 中 outcome 使用 win 渐变色
      return {
        background:
          'linear-gradient(to right, #BAC1FF 0%, #63FEFE 48%, #FF3EEC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };
    } else {
      // participations 中的样式
      if (outcome === 'Yes') {
        // win: 0% BAC1FF；48% 63FEFE 100%： FF3EEC
        return {
          background:
            'linear-gradient(to right, #BAC1FF 0%, #63FEFE 48%, #FF3EEC 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        };
      } else if (outcome === 'No') {
        // lose: 0: CB30E0, 48%: B84DFF 100%: 312E81
        return {
          background:
            'linear-gradient(to right, #CB30E0 0%, #B84DFF 48%, #312E81 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        };
      }
    }
    return {};
  };

  // Status 边框样式
  const getStatusBorderStyle = () => {
    if (viewType === 'creations' && status === 'Ongoing') {
      // ongoing 使用 create 按钮的渐变边框
      return {
        background: 'linear-gradient(to right, #1FA2FF, #12D8FA, #6155F5)',
        padding: '2px',
        borderRadius: '9999px',
      };
    }
    return {};
  };

  if (viewType === 'creations') {
    return (
      <tr className="border-b border-[#2DC3D9]/30 transition-colors hover:bg-[#2DC3D9]/5">
        {/* Prediction - 最长为340像素，超过支持换行，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <p
            className="break-words font-medium text-white"
            style={{ maxWidth: '340px', margin: '0 auto' }}
          >
            {prediction}
          </p>
        </td>

        {/* Total Volume - 正常展示，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <span className="text-white">{totalVolume}</span>
        </td>

        {/* Rewards - 正常展示，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <span className="font-semibold text-white">
            ${typeof rewards === 'number' ? rewards.toFixed(2) : '0.00'}
          </span>
        </td>

        {/* Time - 正常展示，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <span className="text-gray-400">{time}</span>
        </td>

        {/* Status - 如果是 ongoing，边框使用渐变，居中对齐 */}
        <td className="px-6 py-4 text-center">
          {status === 'Ongoing' ? (
            <div
              style={getStatusBorderStyle()}
              className="inline-block rounded-full"
            >
              <span className="block rounded-full bg-[#0B041E] px-3 py-1 text-sm font-semibold text-white">
                {status}
              </span>
            </div>
          ) : (
            <span className="rounded-full border border-[#86FDE8] bg-[#86FDE8]/10 px-3 py-1 text-sm font-semibold text-[#86FDE8]">
              {status}
            </span>
          )}
        </td>

        {/* Outcome - 使用 win 渐变色，居中对齐 */}
        <td className="px-6 py-4 text-center">
          <span className="font-semibold" style={getOutcomeStyle()}>
            {outcome || '-'}
          </span>
        </td>

        {/* Claim Reward - Creator 领取奖励按钮，仅在 Resolved 状态下显示 */}
        <td className="px-6 py-4 text-center">
          {status === 'Resolved' ? (
            creatorFeesClaimed ? (
              <span className="rounded-full border border-green-400 bg-green-400/10 px-3 py-1 text-sm font-semibold text-green-400">
                Claimed
              </span>
            ) : (
              <button
                onClick={handleClaimCreatorFeesClick}
                disabled={isClaimCreatorFeesPending || !marketId}
                className={`rounded-full border px-3 py-1 text-sm font-semibold transition-all ${
                  isClaimCreatorFeesPending
                    ? 'cursor-not-allowed border-gray-500 bg-gray-500/10 text-gray-500'
                    : 'border-[#86FDE8] bg-[#86FDE8]/10 text-[#86FDE8] hover:bg-[#86FDE8]/20'
                }`}
              >
                {isClaimCreatorFeesPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="size-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Claiming...
                  </span>
                ) : (
                  'Claim'
                )}
              </button>
            )
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </td>
      </tr>
    );
  }

  // participations 视图
  return (
    <tr className="border-b border-[#2DC3D9]/30 transition-colors hover:bg-[#2DC3D9]/5">
      {/* Topic - 最长为340像素，超过支持换行，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <p
          className="break-words font-medium text-white"
          style={{ maxWidth: '340px', margin: '0 auto' }}
        >
          {prediction}
        </p>
      </td>

      {/* Side - 显示用户选择的立场，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <span className="text-white">{opinion || '-'}</span>
      </td>

      {/* Wager - 显示投注金额，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <span className="font-semibold text-white">
          ${betAmount > 0 ? betAmount.toFixed(2) : '0.00'}
        </span>
      </td>

      {/* Result - Win/Loss/TBD，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <span
          className={`font-semibold ${
            actualOutcome === 'Win'
              ? 'text-green-400'
              : actualOutcome === 'Loss'
                ? 'text-red-400'
                : 'text-gray-400'
          }`}
        >
          {actualOutcome}
        </span>
      </td>

      {/* Potential Winnings - 显示预期收益，居中对齐 */}
      <td className="px-6 py-4 text-center">
        <span className="font-semibold text-white">
          ${actualOutcome === 'Loss' ? '0.00' : expectedPayout > 0 ? expectedPayout.toFixed(2) : '0.00'}
        </span>
      </td>

      {/* Status - Ongoing/Claimed/Claim，居中对齐 */}
      <td className="px-6 py-4 text-center">
        {displayStatus === 'Claim' ? (
          <button
            onClick={handleClaimClick}
            disabled={isPending || !marketId}
            className={`rounded-full border px-3 py-1 text-sm font-semibold transition-all ${
              isPending
                ? 'cursor-not-allowed border-gray-500 bg-gray-500/10 text-gray-500'
                : 'border-[#86FDE8] bg-[#86FDE8]/10 text-[#86FDE8] hover:bg-[#86FDE8]/20'
            }`}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Claiming...
              </span>
            ) : (
              'Claim'
            )}
          </button>
        ) : (
          <span
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${
              displayStatus === 'Claimed'
                ? 'border-green-400 bg-green-400/10 text-green-400'
                : 'border-[#CB30E0] bg-[#CB30E0]/10 text-[#CB30E0]'
            }`}
          >
            {displayStatus}
          </span>
        )}
      </td>
    </tr>
  );
};
