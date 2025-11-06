'use client';

import React from 'react';
import { PredictionCard, PredictionCardData } from './PredictionCard';

interface AuctionGridProps {
  predictions: Array<{
    id: string;
    image: string;
    title: string;
    yesPercentage: number;
    noPercentage: number;
    totalVolume: string;
    timeRemaining: string;
  }>;
  onPredictionClick?: (prediction: PredictionCardData) => void;
}

/**
 * 拍卖网格组件 - 展示多个预言卡片
 */
export const AuctionGrid: React.FC<AuctionGridProps> = ({ predictions, onPredictionClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-8">
      {predictions.map((prediction) => (
        <PredictionCard
          key={prediction.id}
          {...prediction}
          onCardClick={onPredictionClick}
        />
      ))}
    </div>
  );
};
