'use client';

import React, { useState } from 'react';

import { CreatePredictionModal } from '../modals/CreatePredictionModal';
import { UserDetailModal } from '../modals/UserDetailModal';
import { AuctionGrid } from './AuctionGrid';
import { PredictionCardData } from './PredictionCard';
import { usePredictionMarkets } from '@/hooks/usePredictionMarkets';

// 示例数据
const MOCK_PREDICTIONS = [
  {
    id: '1',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle',
    title:
      "Will Michelle Yeoh win Best Actress at tomorrow's Oscarsafsd flajsdklfjklas fjklasdjfljasdlkfjklasjflkadsjklfa  dfasljaklsdfjlasdjfl?",
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '2',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar',
    title: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '3',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Award',
    title: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '4',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Movie',
    title: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '5',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Film',
    title: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '6',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cinema',
    title: "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
];

/**
 * 仪表盘内容组件 - 管理预言列表和模态框状态
 * 
 * 从 Supabase 的 markets_readable 表读取数据
 */
export const DashboardContent: React.FC = () => {
  const [selectedPrediction, setSelectedPrediction] =
    useState<PredictionCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 从 Supabase 读取市场数据
  const { predictions, isLoading, error } = usePredictionMarkets();

  const handlePredictionClick = (
    prediction: PredictionCardData,
    option?: 'yes' | 'no',
  ) => {
    setSelectedPrediction({
      ...prediction,
      option: option || '',
    });
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-[20px]">
        <div className="px-[24px] h-[56px] flex items-center justify-center border border-[#60A5FA] rounded-[10px]">
          Popular Live Auction
        </div>
        <button
          onClick={handleCreateClick}
          className="h-[56px] rounded-[10px] p-[2px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <div className="size-full flex items-center justify-center rounded-[8px] bg-[#0B041E] px-[24px] text-white font-semibold">
            Create
          </div>
        </button>
      </div>

      {/* 显示加载状态或错误信息 */}
      {isLoading && (
        <div className="mb-4 text-center text-gray-400">
          正在从数据库加载市场数据...
        </div>
      )}
      {error && (
        <div className="mb-4 text-center text-red-400">
          加载失败: {error.message || '未知错误'}
        </div>
      )}

      {!isLoading && predictions.length === 0 && !error && (
        <div className="mb-4 text-center text-gray-400">
          暂无市场数据
        </div>
      )}

      <AuctionGrid
        predictions={predictions}
        onPredictionClick={handlePredictionClick}
      />

      {selectedPrediction && (
        <UserDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTimeout(() => setSelectedPrediction(null), 300);
          }}
          prediction={selectedPrediction}
        />
      )}

      <CreatePredictionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
