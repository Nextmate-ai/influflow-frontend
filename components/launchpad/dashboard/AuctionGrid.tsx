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
export const AuctionGrid: React.FC<AuctionGridProps> = ({
  predictions,
  onPredictionClick,
}) => {
  return (
    <div
      className="grid gap-x-[52px] gap-y-[42px]"
      style={{
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      }}
    >
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
