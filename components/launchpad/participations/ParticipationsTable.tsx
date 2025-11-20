'use client';

import React from 'react';

import { useUserParticipations } from '@/hooks/useUserParticipations';

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

  const displayData = participations;

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-[#2DC3D9] bg-[#0B041E]">
      {/* 表格 */}
      <div className="table-scrollbar flex-1 overflow-y-auto px-6 py-6">
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
                      Prediction
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Opinion
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Bet
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      Outcome
                    </th>
                    <th className="px-6 py-4 text-center font-normal text-[#8ae5f6]">
                      To Win
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
