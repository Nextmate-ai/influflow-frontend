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
    // 从 predictions 列表中找到对应的完整数据（包含 rawData）
    const fullPrediction = predictions.find((p) => p.id === prediction.id);

    // 调试：检查数据传递
    console.log('点击预测卡片:', {
      predictionId: prediction.id,
      foundFullPrediction: !!fullPrediction,
      hasRawData: !!(fullPrediction?.rawData || prediction.rawData),
      rawDataKeys: fullPrediction?.rawData
        ? Object.keys(fullPrediction.rawData)
        : [],
    });

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
