'use client';

import React from 'react';
import { Input } from '@heroui/react';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 标题输入组件 - 用于创建新的预言市场
 */
export const TitleInput: React.FC<TitleInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter your prediction question...',
}) => {
  return (
    <div>
      <label className="block text-white text-sm font-semibold mb-3">Title</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
        classNames={{
          input: 'bg-transparent text-white text-lg',
          inputWrapper: 'bg-slate-800 border-2 border-slate-600 hover:border-cyan-500 focus:border-cyan-400 rounded-lg',
        }}
      />
      <p className="text-slate-400 text-xs mt-2">
        Create a clear, specific prediction question for the market
      </p>
    </div>
  );
};
