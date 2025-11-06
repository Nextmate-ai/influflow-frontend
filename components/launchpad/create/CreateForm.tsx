'use client';

import React, { useState } from 'react';
import { TitleInput } from './TitleInput';
import { OptionsInput } from './OptionsInput';
import { DatePicker } from './DatePicker';
import { ActionButtons } from './ActionButtons';

interface CreateFormData {
  title: string;
  options: string[];
  closingTime: string;
  resultTime: string;
}

/**
 * 创建表单组件 - 完整的预言市场创建表单
 * 集成所有表单子组件并管理表单状态
 */
export const CreateForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateFormData>({
    title: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    options: ['Yes', 'No'],
    closingTime: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    resultTime: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (action: 'generate' | 'draft' | 'create') => {
    setIsLoading(true);
    try {
      // 这里添加实际的 API 调用逻辑
      console.log(`${action} action with form data:`, formData);
      // 模拟异步操作
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-2xl mx-auto px-6 pb-12">
        {/* 表单标题 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create a New Prediction Market</h2>
          <p className="text-slate-400">
            Define your market clearly to attract predictors and set the rules for resolution
          </p>
        </div>

        {/* 表单容器 */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-2 border-slate-700 rounded-2xl p-8 space-y-8">
          {/* 标题输入 */}
          <TitleInput
            value={formData.title}
            onChange={(title) => setFormData({ ...formData, title })}
          />

          {/* 选项输入 */}
          <div className="border-t border-slate-700 pt-6">
            <OptionsInput
              options={formData.options}
              onChange={(options) => setFormData({ ...formData, options })}
            />
          </div>

          {/* 日期选择 */}
          <div className="border-t border-slate-700 pt-6">
            <DatePicker
              closingTime={formData.closingTime}
              resultTime={formData.resultTime}
              onClosingTimeChange={(closingTime) =>
                setFormData({ ...formData, closingTime })
              }
              onResultTimeChange={(resultTime) =>
                setFormData({ ...formData, resultTime })
              }
            />
          </div>

          {/* 操作按钮 */}
          <div className="border-t border-slate-700 pt-6">
            <ActionButtons
              isLoading={isLoading}
              onGenerateByInfluxy={() => handleSubmit('generate')}
              onSaveAsDraft={() => handleSubmit('draft')}
              onCreateMarket={() => handleSubmit('create')}
            />
          </div>
        </div>

        {/* 帮助提示 */}
        <div className="mt-8 p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Tips for creating a successful market:</h3>
          <ul className="text-slate-400 text-sm space-y-1 list-disc list-inside">
            <li>Make your question clear and unambiguous</li>
            <li>Set realistic closing and result announcement times</li>
            <li>Define how the outcome will be determined</li>
            <li>Consider market relevance and appeal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
