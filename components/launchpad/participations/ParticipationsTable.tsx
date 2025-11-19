'use client';

import React from 'react';
import { Tabs, Tab } from '@heroui/react';
import { ParticipationRow } from './ParticipationRow';
import { ParticipationStats } from './ParticipationStats';
import { useUserParticipations } from '@/hooks/useUserParticipations';

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
  const { participations, isLoading, error } = useUserParticipations(viewType);

  const displayData = participations;

  // 计算总收益（暂时使用占位符）
  const totalEarnings = participations.reduce((sum, p) => sum + p.rewards, 0);
  const formattedEarnings = `$${totalEarnings.toFixed(2)}`;

  return (
    <div className="bg-[#0B041E] border border-[#2DC3D9] rounded-2xl overflow-hidden flex flex-col h-[600px]">
      {/* 统计信息 */}
      <ParticipationStats totalEarnings={formattedEarnings} />

      {/* 表格 */}
      <div className="px-6 pb-6 flex-1 overflow-y-auto table-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400">Error: {error.message}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0B041E] z-10">
              <tr className="border-b border-[#2DC3D9]">
                {viewType === 'participations' ? (
                  <>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Prediction
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Opinion
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Outcome
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Profit/Lose
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Time
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Status
                    </th>
                  </>
                ) : (
                  <>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Prediction
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Total Volume
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Rewards
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Time
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Status
                    </th>
                    <th className="text-center px-6 py-4 text-[#8ae5f6] font-normal">
                      Outcome
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
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={viewType === 'participations' ? 6 : 6}
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
