'use client';

import React, { useState } from 'react';
import { Input } from '@heroui/react';

interface DatePickerProps {
  closingTime: string;
  resultTime: string;
  onClosingTimeChange: (date: string) => void;
  onResultTimeChange: (date: string) => void;
}

/**
 * 日期选择器组件 - 用于设置预言市场的截止和结果时间
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  closingTime,
  resultTime,
  onClosingTimeChange,
  onResultTimeChange,
}) => {
  return (
    <div className="space-y-4">
      {/* 截止时间 */}
      <div>
        <label className="block text-white text-sm font-semibold mb-3">
          Prediction pool closing time
        </label>
        <Input
          type="datetime-local"
          value={closingTime}
          onChange={(e) => onClosingTimeChange(e.target.value)}
          className="w-full"
          classNames={{
            input: 'bg-transparent text-white',
            inputWrapper: 'bg-slate-800 border-2 border-slate-600 hover:border-cyan-500 focus:border-cyan-400 rounded-lg',
          }}
        />
      </div>

      {/* 结果时间 */}
      <div>
        <label className="block text-white text-sm font-semibold mb-3">
          Result announcement time
        </label>
        <Input
          type="datetime-local"
          value={resultTime}
          onChange={(e) => onResultTimeChange(e.target.value)}
          className="w-full"
          classNames={{
            input: 'bg-transparent text-white',
            inputWrapper: 'bg-slate-800 border-2 border-slate-600 hover:border-cyan-500 focus:border-cyan-400 rounded-lg',
          }}
        />
      </div>

      <p className="text-slate-400 text-xs">
        Set clear dates when the prediction pool closes and when results will be announced
      </p>
    </div>
  );
};
