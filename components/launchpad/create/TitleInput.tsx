'use client';

import { Input } from '@heroui/react';
import React from 'react';

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
      <label className="mb-3 block text-sm font-semibold text-white">
        Title
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
        classNames={{
          input: 'bg-transparent text-white text-lg',
          inputWrapper:
            'bg-slate-800 border-2 border-slate-600 hover:border-cyan-500 focus:border-cyan-400 rounded-lg',
        }}
      />
      <p className="mt-2 text-xs text-slate-400">
        Create a clear, specific prediction question for the market
      </p>
    </div>
  );
};
