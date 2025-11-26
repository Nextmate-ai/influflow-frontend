'use client';

import { Button, Input } from '@heroui/react';
import React, { useState } from 'react';

interface OptionsInputProps {
  options: string[];
  onChange: (options: string[]) => void;
}

/**
 * 选项输入组件 - 用于添加预言市场的选项（通常是 Yes/No）
 */
export const OptionsInput: React.FC<OptionsInputProps> = ({
  options,
  onChange,
}) => {
  const [localOptions, setLocalOptions] = useState<string[]>(
    options || ['Yes', 'No'],
  );

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...localOptions];
    newOptions[index] = value;
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const addOption = () => {
    const newOptions = [...localOptions, ''];
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-white">
        Options
      </label>
      <div className="space-y-3">
        {localOptions.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1"
              classNames={{
                input: 'bg-transparent text-white',
                inputWrapper:
                  'bg-slate-800 border-2 border-slate-600 hover:border-cyan-500 focus:border-cyan-400 rounded-lg',
              }}
            />
            {localOptions.length > 2 && (
              <Button
                isIconOnly
                onClick={() => removeOption(index)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                ✕
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={addOption}
        className="mt-3 bg-slate-700 font-semibold text-cyan-400 hover:bg-slate-600"
      >
        + Add Option
      </Button>

      <p className="mt-2 text-xs text-slate-400">
        Add options for the prediction market (minimum 2)
      </p>
    </div>
  );
};
