'use client';

import { Input } from '@heroui/react';
import React from 'react';

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
        <label className="mb-3 block text-sm font-semibold text-white">
          Prediction pool closing time
        </label>
        <Input
          type="datetime-local"
          value={closingTime}
          onChange={(e) => onClosingTimeChange(e.target.value)}
          className="w-full [&_input::-webkit-calendar-picker-indicator]:cursor-pointer [&_input::-webkit-datetime-edit-text]:text-white [&_input::-webkit-datetime-edit-month-field]:text-white [&_input::-webkit-datetime-edit-day-field]:text-white [&_input::-webkit-datetime-edit-year-field]:text-white [&_input::-webkit-datetime-edit-hour-field]:text-white [&_input::-webkit-datetime-edit-minute-field]:text-white [&_input::-webkit-datetime-edit-ampm-field]:text-white"
          lang="en"
          classNames={{
            input: 'bg-transparent text-white',
            inputWrapper:
              'bg-slate-800 border-2 border-slate-600 hover:border-cyan-500 focus:border-cyan-400 rounded-lg',
          }}
        />
      </div>

      {/* 结果时间 */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-white">
          Result announcement time
        </label>
        <Input
          type="datetime-local"
          value={resultTime}
          onChange={(e) => onResultTimeChange(e.target.value)}
          className="w-full [&_input::-webkit-calendar-picker-indicator]:cursor-pointer [&_input::-webkit-datetime-edit-text]:text-white [&_input::-webkit-datetime-edit-month-field]:text-white [&_input::-webkit-datetime-edit-day-field]:text-white [&_input::-webkit-datetime-edit-year-field]:text-white [&_input::-webkit-datetime-edit-hour-field]:text-white [&_input::-webkit-datetime-edit-minute-field]:text-white [&_input::-webkit-datetime-edit-ampm-field]:text-white"
          lang="en"
          classNames={{
            input: 'bg-transparent text-white',
            inputWrapper:
              'bg-slate-800 border-2 border-slate-600 hover:border-cyan-500 focus:border-cyan-400 rounded-lg',
          }}
        />
      </div>

      <p className="text-xs text-slate-400">
        Set clear dates when the prediction pool closes and when results will be
        announced
      </p>
    </div>
  );
};
