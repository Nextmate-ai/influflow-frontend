'use client';

import React, { useState } from 'react';
import { AuctionGrid } from './AuctionGrid';
import { UserDetailModal } from '../modals/UserDetailModal';
import { PredictionCardData } from './PredictionCard';

// 示例数据
const MOCK_PREDICTIONS = [
  {
    id: '1',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle',
    title: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '2',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar',
    title: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '3',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Award',
    title: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '4',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Movie',
    title: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '5',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Film',
    title: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
  {
    id: '6',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cinema',
    title: 'Will Michelle Yeoh win Best Actress at tomorrow\'s Oscars?',
    yesPercentage: 43,
    noPercentage: 57,
    totalVolume: '3k Vol.',
    timeRemaining: '18d : 17h',
  },
];

/**
 * 仪表盘内容组件 - 管理预言列表和模态框状态
 */
export const DashboardContent: React.FC = () => {
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePredictionClick = (prediction: PredictionCardData) => {
    setSelectedPrediction(prediction);
    setIsModalOpen(true);
  };

  return (
    <>
      <AuctionGrid predictions={MOCK_PREDICTIONS} onPredictionClick={handlePredictionClick} />

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
    </>
  );
};
