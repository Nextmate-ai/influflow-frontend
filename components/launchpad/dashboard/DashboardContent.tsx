'use client';

import React, { useState } from 'react';

import { usePredictionMarkets } from '@/hooks/usePredictionMarkets';

import { CreatePredictionModal } from '../modals/CreatePredictionModal';
import { UserDetailModal } from '../modals/UserDetailModal';

import { AuctionGrid } from './AuctionGrid';
import { PredictionCardData } from './PredictionCard';

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
type FilterStatus = 'live' | 'finished';

export const DashboardContent: React.FC = () => {
  const [selectedPrediction, setSelectedPrediction] =
    useState<PredictionCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('live');

  // 从 Supabase 读取市场数据
  const { predictions, isLoading, error, refresh } = usePredictionMarkets();

  // 根据筛选状态过滤预测
  const filteredPredictions = predictions.filter((prediction) => {
    const state = prediction.rawData?.state;
    if (filterStatus === 'live') {
      // Live: 显示 Active 状态
      return state === 0 || state === '0' || state === 'Active';
    } else if (filterStatus === 'finished') {
      // Finished: 显示 Resolved 或 Void 状态
      return (
        state === 1 ||
        state === '1' ||
        state === 'Resolved' ||
        state === 2 ||
        state === '2' ||
        state === 'Void'
      );
    }
    return true;
  });

  const handlePredictionClick = (
    prediction: PredictionCardData,
    option?: 'yes' | 'no',
  ) => {
    // 从 predictions 列表中找到对应的完整数据（包含 rawData）
    const fullPrediction = predictions.find((p) => p.id === prediction.id);

    setSelectedPrediction({
      ...prediction,
      // 如果找到了完整数据，使用它的 rawData，否则使用传入的 rawData
      rawData: fullPrediction?.rawData || prediction.rawData,
      option: option || '',
    });
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div>
      <div className="mb-[20px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Radio 切换按钮 */}
          <div className="flex h-[56px] items-center gap-2 rounded-[10px] border border-[#60A5FA] bg-[#0B041E] p-1">
            <button
              onClick={() => setFilterStatus('live')}
              className={`flex h-full items-center justify-center rounded-lg px-6 text-base font-semibold transition-all duration-200 ${
                filterStatus === 'live'
                  ? 'bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setFilterStatus('finished')}
              className={`flex h-full items-center justify-center rounded-lg px-6 text-base font-semibold transition-all duration-200 ${
                filterStatus === 'finished'
                  ? 'bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Finished
            </button>
          </div>
        </div>
        <button
          onClick={handleCreateClick}
          className="h-[56px] rounded-[10px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] p-[2px] transition-all hover:shadow-lg hover:shadow-cyan-500/50"
        >
          <div className="flex size-full items-center justify-center rounded-[8px] bg-[#0B041E] px-[24px] font-semibold text-white">
            Create
          </div>
        </button>
      </div>

      <AuctionGrid
        predictions={filteredPredictions}
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
          onSuccess={() => {
            // 下注成功后刷新数据
            refresh();
          }}
        />
      )}

      <CreatePredictionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // 创建成功后刷新数据
          refresh();
        }}
      />
    </div>
  );
};
