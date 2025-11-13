'use client';

import React from 'react';

interface ParticipationRowProps {
  prediction: string;
  totalVolume: string;
  rewards: number;
  time: string;
  status: 'Ongoing' | 'Finished';
  outcome: 'Yes' | 'No' | null;
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
}) => {
  const statusColor = status === 'Ongoing' ? 'text-cyan-400 border-cyan-400' : 'text-emerald-400 border-emerald-400';
  const outcomeColor = outcome === 'Yes' ? 'text-cyan-400' : outcome === 'No' ? 'text-violet-400' : 'text-slate-400';

  return (
    <tr className="border-b border-[#2DC3D9]/30 hover:bg-[#2DC3D9]/5 transition-colors">
      {/* 预言标题 */}
      <td className="px-6 py-4">
        <p className="text-white font-medium">{prediction}</p>
      </td>

      {/* 交易量 */}
      <td className="px-6 py-4">
        <span className="text-[#86FDE8] font-semibold">{totalVolume}</span>
      </td>

      {/* 奖励 */}
      <td className="px-6 py-4">
        <span className="text-white font-semibold">{rewards}</span>
      </td>

      {/* 时间 */}
      <td className="px-6 py-4">
        <span className="text-gray-400">{time}</span>
      </td>

      {/* 状态 */}
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 border border-[#CB30E0] rounded-full text-sm font-semibold ${
            status === 'Ongoing'
              ? 'text-[#CB30E0] bg-[#CB30E0]/10'
              : 'text-[#86FDE8] bg-[#86FDE8]/10 border-[#86FDE8]'
          }`}
        >
          {status}
        </span>
      </td>

      {/* 结果 */}
      <td className="px-6 py-4">
        <span className={`font-semibold ${outcomeColor}`}>
          {outcome || '-'}
        </span>
      </td>
    </tr>
  );
};
