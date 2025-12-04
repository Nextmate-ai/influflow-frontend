'use client';

import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { usePredictionMarkets, MarketSortBy, StateFilter } from '@/hooks/usePredictionMarkets';

import { CreatePredictionModal } from '../modals/CreatePredictionModal';
import { UserDetailModal } from '../modals/UserDetailModal';
import { DashboardContentSkeleton } from '../skeletons/DashboardContentSkeleton';

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
type FilterStatus = 'trending' | 'new' | 'finished';

export const DashboardContent: React.FC = () => {
  const [selectedPrediction, setSelectedPrediction] =
    useState<PredictionCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('trending');

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 获取 URL 参数
  const searchParams = useSearchParams();
  const marketIdParam = searchParams.get('marketId');

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, []);

  // 根据 filterStatus 计算排序方式
  const sortBy: MarketSortBy =
    filterStatus === 'trending' ? 'volume' :
    filterStatus === 'new' ? 'created_at' :
    'end_time';

  // 根据 filterStatus 计算状态过滤
  const stateFilter: StateFilter =
    filterStatus === 'trending' || filterStatus === 'new' ? 'active' : 'finished';

  // 从 Supabase 读取市场数据
  const { predictions, isLoading, error, refresh } = usePredictionMarkets(sortBy, stateFilter);

  // 处理分享链接：自动打开对应的 market Modal
  useEffect(() => {
    // 如果没有 marketId 参数，或数据还在加载，或 predictions 为空，或 Modal 已打开，则不处理
    if (!marketIdParam || isLoading || !predictions.length || isModalOpen) {
      return;
    }

    // 查找对应的 prediction
    const targetPrediction = predictions.find((p) => p.id === marketIdParam);
    if (!targetPrediction) {
      // marketId 不存在，静默处理
      return;
    }

    // 检查市场状态是否为 Active
    const state = targetPrediction.rawData?.state;
    const isActive =
      state === 0 || state === '0' || state === 'Active' || state === undefined;
    if (!isActive) {
      // 市场已结束，不打开 Modal
      return;
    }

    // 打开 Modal
    handlePredictionClick(targetPrediction);

    // 清除 URL 参数（保持 URL 清洁）
    window.history.replaceState({}, '', '/launchpad');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketIdParam, predictions, isModalOpen, isLoading]);

  // 使用 useCallback 包装 refresh 回调，避免每次渲染都创建新函数
  const handleSuccess = useCallback(() => {
    refresh();
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(() => {
      refresh();
      refreshTimeoutRef.current = null;
    }, 5000);
  }, [refresh]);

  // 不需要客户端过滤了，Supabase 已经根据 stateFilter 过滤了数据

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
      <div className="mb-4 flex flex-row items-center justify-between gap-2 md:mb-[40px] md:gap-0">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Radio 切换按钮 - 3个标签 */}
          <div className="flex h-[40px] items-center gap-1 rounded-[10px] bg-[#0B041E] p-1 md:h-[48px] md:gap-2">
            <button
              onClick={() => setFilterStatus('trending')}
              className={`flex h-full w-[70px] items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 md:w-[100px] md:text-base ${
                filterStatus === 'trending'
                  ? 'bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setFilterStatus('new')}
              className={`flex h-full w-[70px] items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 md:w-[100px] md:text-base ${
                filterStatus === 'new'
                  ? 'bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              New
            </button>
            <button
              onClick={() => setFilterStatus('finished')}
              className={`flex h-full w-[70px] items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 md:w-[100px] md:text-base ${
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
          className="h-[40px] w-[80px] rounded-[10px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] p-[2px] transition-all hover:shadow-lg hover:shadow-cyan-500/50 md:h-[48px] md:w-[150px]"
        >
          <div className="flex size-full items-center justify-center rounded-[8px] bg-[#0B041E] px-2 text-xs font-semibold text-white md:px-[24px] md:text-base">
            Create
          </div>
        </button>
      </div>

      {/* 加载状态：显示骨架屏 */}
      {isLoading && predictions.length === 0 ? (
        <DashboardContentSkeleton />
      ) : (
        <AuctionGrid
          key={filterStatus}
          predictions={predictions}
          onPredictionClick={handlePredictionClick}
          filterStatus={filterStatus}
        />
      )}

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
