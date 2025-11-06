'use client';

import React from 'react';
import { Tabs, Tab } from '@heroui/react';
import { ParticipationRow } from './ParticipationRow';
import { ParticipationStats } from './ParticipationStats';

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

/**
 * 参与表格组件 - 显示用户的所有参与历史
 */
export const ParticipationsTable: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden">
      {/* 统计信息 */}
      <ParticipationStats totalEarnings="$2,236" />

      {/* 标签页 */}
      <div className="px-6 mb-6 border-b border-slate-700">
        <Tabs
          aria-label="Participations"
          color="primary"
          className="w-full"
          classNames={{
            tabList: 'gap-6 w-full border-0 p-0 bg-transparent',
            cursor: 'w-full bg-gradient-to-r from-cyan-500 to-blue-500',
            tab: 'max-w-fit px-0 h-12 text-slate-400 hover:text-white data-[selected=true]:text-white font-semibold',
            tabContent: 'group-data-[selected=true]:text-white',
          }}
        >
          <Tab key="participations" title="Participations">
            <div className="pb-6">
              {/* 表格 */}
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left px-6 py-4 text-slate-400 font-semibold">
                      Prediction
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-semibold">
                      Total Volume
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-semibold">
                      Rewards
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-semibold">
                      Time
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-semibold">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-semibold">
                      Outcome
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PARTICIPATIONS.map((participation, index) => (
                    <ParticipationRow key={index} {...participation} />
                  ))}
                </tbody>
              </table>
            </div>
          </Tab>

          <Tab key="creations" title="Creations">
            <div className="pb-6">
              <div className="text-center py-8">
                <p className="text-slate-400">No creations yet. Start by creating a prediction market!</p>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};
