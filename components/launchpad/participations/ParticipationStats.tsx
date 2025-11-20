'use client';

import React from 'react';

interface ParticipationStatsProps {
  totalEarnings: string;
}

/**
 * 参与统计组件 - 显示总收益信息
 */
export const ParticipationStats: React.FC<ParticipationStatsProps> = ({
  totalEarnings,
}) => {
  return (
    <div className="mb-6 flex items-center justify-end px-6 pt-6">
      <div className="text-right">
        <p className="mb-1 text-sm text-gray-400">Total Earnings</p>
        <p className="text-3xl font-bold text-[#86FDE8]">{totalEarnings}</p>
      </div>
    </div>
  );
};
