'use client';

import React from 'react';

import { useUserParticipations } from '@/hooks/useUserParticipations';
import { useClaimPayout } from '@/hooks/useClaimPayout';
import { useClaimCreatorFees } from '@/hooks/useClaimCreatorFees';

import { ParticipationRow } from './ParticipationRow';

type ViewType = 'participations' | 'creations';

interface ParticipationsTableProps {
  viewType?: ViewType;
}

/**
 * 参与表格组件 - 显示用户的所有参与历史
 */
export const ParticipationsTable: React.FC<ParticipationsTableProps> = ({
  viewType = 'participations',
}) => {
  // 使用 hook 加载真实数据
  const { participations, isLoading, error, refetch } =
    useUserParticipations(viewType);
  const { claimPayout, isPending: isClaimPending } = useClaimPayout();
  const { claimCreatorFees, isPending: isClaimCreatorFeesPending } =
    useClaimCreatorFees();

  const displayData = participations;

  // 计算总收益
  const totalEarnings = React.useMemo(() => {
    if (viewType === 'creations') {
      const total = displayData.reduce((sum, item) => {
        return sum + (item.rewards || 0);
      }, 0);
      return `$${total.toFixed(2)}`;
    } else {
      // 对于 participations，计算已实现的收益
      const total = displayData.reduce((sum, item) => {
        if (item.marketOutcome && item.opinion === item.marketOutcome && item.expectedPayout) {
          return sum + (item.expectedPayout - (item.betAmount || 0));
        }
        return sum;
      }, 0);
      return `$${total.toFixed(2)}`;
    }
  }, [displayData, viewType]);

  const handleMobileClaim = async (marketId?: string) => {
    if (!marketId) return;
    try {
      if (viewType === 'participations') {
        await claimPayout({ marketId: BigInt(marketId) });
      } else {
        await claimCreatorFees({ marketId: BigInt(marketId) });
      }
      refetch();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  return (
    <div className="flex h-full md:h-[600px] flex-col overflow-hidden rounded-2xl bg-[#0B041E]">
      {/* Total Earnings 显示 */}
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2 border-b border-[#2DC3D9]/20">
        <div className="text-sm text-gray-400 mb-1">Total Earnings</div>
        <div className="text-2xl md:text-3xl font-bold text-white">{totalEarnings}</div>
      </div>

      {/* 移动端卡片列表 */}
      <div className="md:hidden flex-1 overflow-y-auto py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-red-400">Error: {error.message}</p>
          </div>
        ) : displayData.length > 0 ? (
          <div className="space-y-4">
            {displayData.map((item, index) => (
              <div
                key={item.marketId || index}
                className="rounded-xl border border-[#075985] bg-[#0B041E] p-4"
              >
                {/* 预测问题 */}
                <div className="text-base font-medium text-white mb-4 line-clamp-2">
                  {item.prediction}
                </div>

                {/* 信息列表 */}
                <div className="space-y-0">
                  {viewType === 'participations' ? (
                    <>
                      {/* Side */}
                      <div className="flex flex-row items-center justify-between h-9 border-b border-[#2DC3D9]/20">
                        <span className="text-sm text-white">Side</span>
                        <span className="text-sm text-white font-medium">{item.opinion || '-'}</span>
                      </div>
                      {/* Wager */}
                      <div className="flex flex-row items-center justify-between h-9 border-b border-[#2DC3D9]/20">
                        <span className="text-sm text-white">Wager</span>
                        <span className="text-sm text-white font-semibold">${item.betAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                      {/* Result */}
                      <div className="flex flex-row items-center justify-between h-9 border-b border-[#2DC3D9]/20">
                        <span className="text-sm text-white">Result</span>
                        <span className={`text-sm font-semibold ${
                          item.marketOutcome && item.opinion === item.marketOutcome
                            ? 'text-green-400'
                            : item.marketOutcome
                              ? 'text-red-400'
                              : 'text-gray-400'
                        }`}>
                          {item.marketOutcome && item.opinion === item.marketOutcome
                            ? 'Win'
                            : item.marketOutcome
                              ? 'Loss'
                              : '-'}
                        </span>
                      </div>
                      {/* Potential */}
                      <div className="flex flex-row items-center justify-between h-9 border-b border-[#2DC3D9]/20">
                        <span className="text-sm text-white">Potential</span>
                        <span className="text-sm text-white font-semibold">${item.expectedPayout?.toFixed(2) || '0.00'}</span>
                      </div>
                      {/* Status */}
                      <div className="flex flex-row items-center justify-between h-9">
                        <span className="text-sm text-white">Status</span>
                        <div className="flex items-center gap-2">
                          {item.marketState?.toLowerCase() === 'active' ? (
                            <span className="text-xs px-3 py-1 rounded-full font-semibold border border-[#CB30E0] bg-[#CB30E0]/10 text-white">
                              Ongoing
                            </span>
                          ) : item.claimed ? (
                            <span className="text-xs px-3 py-1 rounded-full font-semibold border border-green-400 bg-green-400/10 text-green-400">
                              Claimed
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMobileClaim(item.marketId)}
                              disabled={isClaimPending || !item.marketId}
                              className="text-xs px-3 py-1 rounded-full font-semibold border border-[#86FDE8] bg-[#86FDE8]/10 text-[#86FDE8] disabled:opacity-50"
                            >
                              {isClaimPending ? 'Claiming...' : 'Claim'}
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Total Volume */}
                      <div className="flex flex-row items-center justify-between h-9 border-b border-[#2DC3D9]/20">
                        <span className="text-sm text-white">Total Volume</span>
                        <span className="text-sm text-white">{item.totalVolume}</span>
                      </div>
                      {/* Reward */}
                      <div className="flex flex-row items-center justify-between h-9 border-b border-[#2DC3D9]/20">
                        <span className="text-sm text-white">Reward</span>
                        <span className="text-sm text-white font-semibold">{item.rewards?.toFixed(1) || '0.0'}</span>
                      </div>
                      {/* Time */}
                      <div className="flex flex-row items-center justify-between h-9 border-b border-[#2DC3D9]/20">
                        <span className="text-sm text-white">Time</span>
                        <span className="text-sm text-white">{item.time}</span>
                      </div>
                      {/* Status */}
                      <div className="flex flex-row items-center justify-between h-9 border-b border-[#2DC3D9]/20">
                        <span className="text-sm text-white">Status</span>
                        <div
                          className="h-6 px-3 rounded-full flex items-center justify-center"
                          style={{
                            border: '1px solid transparent',
                            background: item.status === 'Ongoing'
                              ? 'linear-gradient(#0B041E, #0B041E) padding-box, linear-gradient(to right, #60A5FA, #870CD8) border-box'
                              : 'transparent',
                            borderColor: item.status === 'Ongoing' ? 'transparent' : '#86FDE8',
                            backgroundColor: item.status === 'Ongoing' ? 'transparent' : 'rgba(134, 253, 232, 0.1)',
                          }}
                        >
                          <span className="text-xs font-semibold text-white">{item.status}</span>
                        </div>
                      </div>
                      {/* Outcome */}
                      <div className="flex flex-row items-center justify-between h-9">
                        <span className="text-sm text-white">Outcome</span>
                        <span
                          className="text-sm font-semibold"
                          style={{
                            background: 'linear-gradient(to right, #60A5FA, #870CD8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {item.outcome || '-'}
                        </span>
                      </div>
                      {/* Claim button for Resolved */}
                      {item.status === 'Resolved' && (
                        <div className="flex flex-row items-center justify-end pt-3 border-t border-[#2DC3D9]/20 mt-3">
                          {item.creatorFeesClaimed ? (
                            <span className="text-xs px-3 py-1 rounded-full border border-green-400 bg-green-400/10 text-green-400 font-semibold">
                              Claimed
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMobileClaim(item.marketId)}
                              disabled={isClaimCreatorFeesPending || !item.marketId}
                              className="text-xs px-3 py-1 rounded-full border border-[#86FDE8] bg-[#86FDE8]/10 text-[#86FDE8] disabled:opacity-50 font-semibold"
                            >
                              {isClaimCreatorFeesPending ? 'Claiming...' : 'Claim'}
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400 text-center">
              {viewType === 'participations'
                ? 'No participations yet.'
                : 'No creations yet. Start by creating a prediction market!'}
            </p>
          </div>
        )}
      </div>

      {/* 桌面端表格 */}
      <div className="hidden md:flex table-scrollbar flex-1 overflow-y-auto p-6 pt-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-red-400">Error: {error.message}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[#0B041E]">
              <tr className="border-b border-[#2DC3D9]">
                {viewType === 'participations' ? (
                  <>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Topic
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Side
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Wager
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Result
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Potential Winnings
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Status
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Prediction
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Total Volume
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Rewards
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Time
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Outcome
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Claim
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {displayData.length > 0 ? (
                displayData.map((item, index) => (
                  <ParticipationRow
                    key={item.marketId || index}
                    {...item}
                    viewType={viewType}
                    onClaimSuccess={refetch}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={viewType === 'participations' ? 6 : 7}
                    className="px-6 py-8 text-center"
                  >
                    <p className="text-gray-400">
                      {viewType === 'participations'
                        ? 'No participations yet.'
                        : 'No creations yet. Start by creating a prediction market!'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
