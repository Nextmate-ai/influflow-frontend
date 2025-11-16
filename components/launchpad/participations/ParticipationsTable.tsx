'use client';

import React from 'react';
import { Tabs, Tab } from '@heroui/react';
import { ParticipationRow } from './ParticipationRow';
import { ParticipationStats } from './ParticipationStats';

type ViewType = 'participations' | 'creations';

// 示例数据
const MOCK_PARTICIPATIONS = [
  {
    prediction: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    totalVolume: '$2.4m',
    rewards: 4.8,
    time: 'June 13, 2025',
    status: 'Ongoing' as const,
    outcome: null,
    opinion: 'Yes' as const,
  },
  {
    prediction: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    totalVolume: '$7.2m',
    rewards: 4.8,
    time: 'June 13, 2025',
    status: 'Ongoing' as const,
    outcome: null,
    opinion: 'No' as const,
  },
  {
    prediction: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    totalVolume: '$1.6m',
    rewards: 4.8,
    time: 'June 13, 2025',
    status: 'Finished' as const,
    outcome: 'Yes' as const,
    opinion: 'Yes' as const,
  },
  {
    prediction: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    totalVolume: '$1.6m',
    rewards: 4.8,
    time: 'June 13, 2025',
    status: 'Finished' as const,
    outcome: 'No' as const,
    opinion: 'No' as const,
  },
];

interface ParticipationsTableProps {
  viewType?: ViewType;
}

/**
 * 参与表格组件 - 显示用户的所有参与历史
 */
export const ParticipationsTable: React.FC<ParticipationsTableProps> = ({
  viewType = 'participations',
}) => {
  // Creations 数据（示例）
  const MOCK_CREATIONS = [
    {
      prediction: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
      totalVolume: '$2.4m',
      rewards: 4.8,
      time: 'June 13, 2025',
      status: 'Ongoing' as const,
      outcome: 'Yes' as const,
      opinion: 'Yes' as const,
    },
    {
      prediction: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
      totalVolume: '$2.4m',
      rewards: 4.8,
      time: 'June 13, 2025',
      status: 'Ongoing' as const,
      outcome: 'Yes' as const,
      opinion: 'Yes' as const,
    },
    {
      prediction: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
      totalVolume: '$1.6m',
      rewards: 4.8,
      time: 'June 13, 2025',
      status: 'Finished' as const,
      outcome: 'No' as const,
      opinion: 'No' as const,
    },
    {
      prediction: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
      totalVolume: '$1.6m',
      rewards: 4.8,
      time: 'June 13, 2025',
      status: 'Finished' as const,
      outcome: 'No' as const,
      opinion: 'No' as const,
    },
    {
      prediction: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
      totalVolume: '$1.6m',
      rewards: 4.8,
      time: 'June 13, 2025',
      status: 'Finished' as const,
      outcome: 'No' as const,
      opinion: 'No' as const,
    },
  ];

  const displayData =
    viewType === 'participations' ? MOCK_PARTICIPATIONS : MOCK_CREATIONS;

  return (
    <div className="bg-[#0B041E] border border-[#2DC3D9] rounded-2xl overflow-hidden flex flex-col h-[600px]">
      {/* 统计信息 */}
      <ParticipationStats totalEarnings="$2,236" />

      {/* 表格 */}
      <div className="px-6 pb-6 flex-1 overflow-y-auto table-scrollbar">
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
                <ParticipationRow key={index} {...item} viewType={viewType} />
              ))
            ) : (
              <tr>
                <td colSpan={viewType === 'participations' ? 6 : 6} className="px-6 py-8 text-center">
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
      </div>
    </div>
  );
};
