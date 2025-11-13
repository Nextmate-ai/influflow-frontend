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
    <div className="flex justify-end items-center mb-6 px-6 pt-6">
      <div className="text-right">
        <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
        <p className="text-3xl font-bold text-[#86FDE8]">{totalEarnings}</p>
      </div>
    </div>
  );
};
