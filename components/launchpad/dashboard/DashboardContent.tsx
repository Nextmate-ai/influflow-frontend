'use client';

import React, { useState, useCallback } from 'react';

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

  // 使用 useCallback 包装 refresh 回调，避免每次渲染都创建新函数
  const handleSuccess = useCallback(() => {
    refresh();
  }, [refresh]);

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

    // 检查市场状态，如果不是活跃状态，不打开下注模态框
    const state = fullPrediction?.rawData?.state || prediction.rawData?.state;
    const isActive =
      state === 0 || state === '0' || state === 'Active' || state === undefined;

    if (!isActive) {
      // 市场已结束，不允许下注
      return;
    }

    setSelectedPrediction({
      ...prediction,
      // 如果找到了完整数据，使用它的 rawData，否则使用传入的 rawData
      rawData: fullPrediction?.rawData || prediction.rawData,
      option: option || '',
    });
    setIsModalOpen(true);
  };

  const handleCreateClick = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateModalClose = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  return (
    <div>
      <div className="mb-4 flex flex-col items-stretch justify-between gap-3 md:mb-[20px] md:flex-row md:items-center md:gap-0">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Radio 切换按钮 */}
          <div className="flex h-[48px] flex-1 items-center gap-1 rounded-[10px] bg-[#0B041E] p-1 md:h-[56px] md:flex-initial md:gap-2">
            <button
              onClick={() => setFilterStatus('live')}
              className={`flex h-full flex-1 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-all duration-200 md:flex-initial md:px-6 md:text-base ${
                filterStatus === 'live'
                  ? 'bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setFilterStatus('finished')}
              className={`flex h-full flex-1 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-all duration-200 md:flex-initial md:px-6 md:text-base ${
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
          className="h-[48px] w-full rounded-[10px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] p-[2px] transition-all hover:shadow-lg hover:shadow-cyan-500/50 md:h-[56px] md:w-auto"
        >
          <div className="flex size-full items-center justify-center rounded-[8px] bg-[#0B041E] px-4 text-sm font-semibold text-white md:px-[24px] md:text-base">
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
          onSuccess={handleSuccess}
        />
      )}

      <CreatePredictionModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
