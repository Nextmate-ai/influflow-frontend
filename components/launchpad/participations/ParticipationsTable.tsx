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
  },
  {
    prediction: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    totalVolume: '$7.2m',
    rewards: 4.8,
    time: 'June 13, 2025',
    status: 'Ongoing' as const,
    outcome: null,
  },
  {
    prediction: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    totalVolume: '$1.6m',
    rewards: 4.8,
    time: 'June 13, 2025',
    status: 'Finished' as const,
    outcome: 'Yes' as const,
  },
  {
    prediction: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    totalVolume: '$1.6m',
    rewards: 4.8,
    time: 'June 13, 2025',
    status: 'Finished' as const,
    outcome: 'No' as const,
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
    },
    {
      prediction: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
      totalVolume: '$2.4m',
      rewards: 4.8,
      time: 'June 13, 2025',
      status: 'Ongoing' as const,
      outcome: 'Yes' as const,
    },
    {
      prediction: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
      totalVolume: '$1.6m',
      rewards: 4.8,
      time: 'June 13, 2025',
      status: 'Finished' as const,
      outcome: 'No' as const,
    },
    {
      prediction: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
      totalVolume: '$1.6m',
      rewards: 4.8,
      time: 'June 13, 2025',
      status: 'Finished' as const,
      outcome: 'No' as const,
    },
    {
      prediction: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
      totalVolume: '$1.6m',
      rewards: 4.8,
      time: 'June 13, 2025',
      status: 'Finished' as const,
      outcome: 'No' as const,
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
              <th className="text-left px-6 py-4 text-white font-semibold">
                Prediction
              </th>
              <th className="text-left px-6 py-4 text-white font-semibold">
                Total Volume
              </th>
              <th className="text-left px-6 py-4 text-white font-semibold">
                Rewards
              </th>
              <th className="text-left px-6 py-4 text-white font-semibold">
                Time
              </th>
              <th className="text-left px-6 py-4 text-white font-semibold">
                Status
              </th>
              <th className="text-left px-6 py-4 text-white font-semibold">
                Outcome
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((item, index) => (
                <ParticipationRow key={index} {...item} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
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
        <style jsx global>{`
          .table-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #2DC3D9 transparent;
          }
          .table-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .table-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .table-scrollbar::-webkit-scrollbar-thumb {
            background-color: #2DC3D9;
            border-radius: 3px;
          }
          .table-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #2DC3D9;
          }
        `}</style>
      </div>
    </div>
  );
};
