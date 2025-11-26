'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';
import React from 'react';

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
    <div className="flex flex-col justify-center gap-3 pt-6 sm:flex-row">
      <Button
        onClick={onGenerateByInfluxy}
        disabled={isLoading}
        className="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3 font-semibold text-white transition-all duration-200 hover:from-cyan-500 hover:to-blue-500"
      >
        Generate prediction market by Influxy
      </Button>

      <Button
        onClick={onSaveAsDraft}
        disabled={isLoading}
        className="rounded-lg bg-slate-700 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-slate-600"
      >
        Save as draft
      </Button>

      <Link href="/launchpad">
        <Button
          onClick={onCreateMarket}
          disabled={isLoading}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-3 font-semibold text-white transition-all duration-200 hover:from-cyan-400 hover:to-purple-400 sm:w-auto"
        >
          Create
        </Button>
      </Link>
    </div>
  );
};
