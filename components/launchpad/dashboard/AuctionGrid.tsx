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
    rawData?: Record<string, any>;
    creatorInfo?: {
      address: string;
      xUsername?: string;
      xName?: string;
      xAvatarUrl?: string;
    };
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
      className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-x-[52px] md:gap-y-[42px]"
    >
      {predictions.map((prediction) => (
        <PredictionCard
          key={prediction.id}
          id={prediction.id}
          image={prediction.image}
          title={prediction.title}
          yesPercentage={prediction.yesPercentage}
          noPercentage={prediction.noPercentage}
          totalVolume={prediction.totalVolume}
          timeRemaining={prediction.timeRemaining}
          rawData={prediction.rawData}
          creatorInfo={prediction.creatorInfo}
          onCardClick={onPredictionClick}
        />
      ))}
    </div>
  );
};
