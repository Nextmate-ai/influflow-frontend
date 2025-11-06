'use client';

import React from 'react';
import { Tooltip } from '@heroui/react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  tooltip?: string;
}

/**
 * 统计卡片组件 - 显示投注金额和时间信息
 */
export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, tooltip }) => {
  const content = (
    <div className="flex items-center gap-2 text-sm">
      {icon}
      <span className="text-slate-400">{label}</span>
      <span className="text-cyan-400 font-semibold">{value}</span>
    </div>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} color="default" className="bg-slate-800 text-slate-200">
        {content}
      </Tooltip>
    );
  }

  return content;
};
