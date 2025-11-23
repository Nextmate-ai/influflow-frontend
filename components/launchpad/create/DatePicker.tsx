'use client';

import React from 'react';

import { CustomDatePicker } from '../shared/CustomDatePicker';

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
        <CustomDatePicker
          value={closingTime}
          onChange={onClosingTimeChange}
          placeholder="Select closing date"
        />
      </div>

      {/* 结果时间 */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-white">
          Result announcement time
        </label>
        <CustomDatePicker
          value={resultTime}
          onChange={onResultTimeChange}
          placeholder="Select result date"
        />
      </div>

      <p className="text-xs text-slate-400">
        Set clear dates when the prediction pool closes and when results will be
        announced
      </p>
    </div>
  );
};
