'use client';

import React from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';

interface ActionButtonsProps {
  onGenerateByInfluxy?: () => void;
  onSaveAsDraft?: () => void;
  onCreateMarket?: () => void;
  isLoading?: boolean;
}

/**
 * 操作按钮组件 - 创建页面的底部操作按钮
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onGenerateByInfluxy,
  onSaveAsDraft,
  onCreateMarket,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
      <Button
        onClick={onGenerateByInfluxy}
        disabled={isLoading}
        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
      >
        Generate prediction market by Influxy
      </Button>

      <Button
        onClick={onSaveAsDraft}
        disabled={isLoading}
        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
      >
        Save as draft
      </Button>

      <Link href="/launchpad">
        <Button
          onClick={onCreateMarket}
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 w-full sm:w-auto"
        >
          Create
        </Button>
      </Link>
    </div>
  );
};
