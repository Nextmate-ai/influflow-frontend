'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, Input } from '@heroui/react';
import Image from 'next/image';
import { GradientSlider } from '../shared/GradientSlider';
import { StatCard } from '../shared/StatCard';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: {
    id: string;
    title: string;
    image: string;
    percentage: number;
    yesPercentage: number;
    noPercentage: number;
    totalVolume: string;
    timeRemaining: string;
    option: string;
  };
}

/**
 * 用户详情模态框 - 显示预言市场详情和投注界面
 * 根据新设计稿实现左右两栏布局
 */
export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  prediction,
}) => {
  const [amount, setAmount] = useState('231');
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no'>('yes');

  // 预测的投票状态（右侧面板使用，可以基于用户选择动态计算）
  const [predictionYesPercentage, setPredictionYesPercentage] = useState(45);
  const [predictionNoPercentage, setPredictionNoPercentage] = useState(55);

  const payoutIfWin = (parseFloat(amount) * 1.076).toFixed(2);

  // 规则文本（示例）
  const rulesText = [
    "The 2025 New York City mayoral election will be held on November 4, 2025, to elect the mayor of New York City.",
    "The 2025 New York City mayoral election will be held on November 4, 2025, to elect the mayor of New York City...",
    "The 2025 New York City mayoral election will be held on November 4, 2025, to elect the mayor of New York City...",
    "The 2025 New York City mayoral election will be held on November 4, 2025, to elect the mayor of New York City.",
    "The 2025 New York City mayoral election will be held on November 4, 2025, to elect the mayor of New York City...",
    "The 2025 New York City mayoral election will be held on November 4, 2025, to elect the mayor of New York City...",
    "The 2025 New York City mayoral election will be held on November 4, 2025, to elect the mayor of New York City.",
    "The 2025 New York City mayoral election will be held on November 4, 2025, to elect the mayor of New York City...",
  ].join('\n\n');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      backdrop="blur"
      className="dark"
      hideCloseButton
    >
      <ModalContent className="bg-[#0B041E] border border-[#60A5FA] rounded-2xl p-0">
        {(onClose) => (
          <div className="flex flex-col h-full max-h-[90vh] relative">
            <div className="flex flex-row h-full overflow-hidden">
              {/* 左侧面板 - 预测详情 */}
              <div className="flex-1 p-8 border-r border-[#60A5FA] overflow-y-auto">
                {/* 用户头像和Name */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/avatar_bg.png"
                      alt={prediction.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="max-w-[100px] truncate bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-transparent text-base font-medium">
                    Name
                  </div>
                </div>

                {/* 预测问题 */}
                <h2 className="text-white text-2xl font-semibold mb-6 leading-tight">
                  {prediction.title}
                </h2>

                {/* 交易量和剩余时间 - 使用 StatCard */}
                <div className="flex items-center gap-4 mb-8">
                  <StatCard
                    icon={
                      <Image
                        src="/images/volume.png"
                        alt="volume"
                        width={12}
                        height={12}
                      />
                    }
                    label=""
                    value={prediction.totalVolume}
                  />
                  <StatCard
                    icon={
                      <Image
                        src="/images/timer.png"
                        alt="timer"
                        width={12}
                        height={12}
                      />
                    }
                    label=""
                    value={prediction.timeRemaining}
                  />
                </div>

                {/* 投票状态 */}
                <div className="mb-8">
                  <div className="text-white text-base font-medium mb-4">
                    Voting Status:
                  </div>
                  <div className="relative w-full h-10 rounded-full overflow-visible">
                    {/* 左侧渐变条 */}
                    <div
                      className="absolute left-0 top-0 h-full rounded-l-full bg-gradient-to-r from-[#00B2FF] to-[#00FFD0] flex items-center"
                      style={{
                        width: `${prediction.yesPercentage}%`,
                        zIndex: 1,
                      }}
                    >
                      <span
                        className="text-white text-sm font-medium whitespace-nowrap"
                        style={{
                          paddingLeft: '12px',
                          paddingRight: prediction.yesPercentage < 20 ? '8px' : '12px',
                        }}
                      >
                        {Math.round(prediction.yesPercentage)}% Yes
                      </span>
                    </div>
                    {/* 右侧渐变条 */}
                    <div
                      className="absolute right-0 top-0 h-full rounded-r-full bg-gradient-to-l from-[#870CD8] to-[#FF2DDF] flex items-center justify-end"
                      style={{
                        width: `${prediction.noPercentage}%`,
                        zIndex: 1,
                      }}
                    >
                      <span
                        className="text-white text-sm font-medium whitespace-nowrap"
                        style={{
                          paddingLeft: prediction.noPercentage < 20 ? '8px' : '12px',
                          paddingRight: '12px',
                        }}
                      >
                        {Math.round(prediction.noPercentage)}% No
                      </span>
                    </div>
                    {/* 分割线 */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-white"
                      style={{
                        left: `${prediction.yesPercentage}%`,
                        transform: 'translateX(-50%)',
                        zIndex: 2,
                      }}
                    />
                    {/* 闪电图标 - 在分割线中间 */}
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        left: `${prediction.yesPercentage}%`,
                        top: '50%',
                        zIndex: 3,
                      }}
                    >
                      <Image
                        src="/images/lightning.png"
                        alt="divider"
                        width={16}
                        height={24}
                        className="h-6 w-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* 规则部分 */}
                <div>
                  <div className="text-white text-base font-medium mb-4">
                    Rules:
                  </div>
                  <div
                    className="text-gray-400 text-sm leading-relaxed max-h-48 overflow-y-auto pr-2 rules-scrollbar"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#2DC3D9 transparent',
                    }}
                  >
                    {rulesText}
                  </div>
                  <style jsx global>{`
                    .rules-scrollbar::-webkit-scrollbar {
                      width: 6px;
                    }
                    .rules-scrollbar::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .rules-scrollbar::-webkit-scrollbar-thumb {
                      background-color: #2DC3D9;
                      border-radius: 3px;
                    }
                    .rules-scrollbar::-webkit-scrollbar-thumb:hover {
                      background-color: #2DC3D9;
                    }
                  `}</style>
                </div>
              </div>

              {/* 右侧面板 - My Bid */}
              <div className="flex-1 p-8 flex flex-col overflow-y-auto">
                {/* My Bid 标题和关闭按钮 */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-white text-2xl font-semibold">My Bid</h3>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 text-2xl font-light"
                  >
                    ✕
                  </button>
                </div>

                {/* Vote for 选项 */}
                <div className="mb-8">
                  <div className="text-[#58C0CE] text-base font-medium mb-4">
                    Vote for:
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedOption('yes')}
                      className={`flex-1 h-12 rounded-2xl font-semibold transition-all duration-200 ${
                        selectedOption === 'yes'
                          ? 'text-white border-2 border-[#07B6D4]'
                          : 'bg-transparent text-gray-400 border-2 border-gray-600 hover:border-gray-500'
                      }`}
                      style={
                        selectedOption === 'yes'
                          ? {
                              background: 'linear-gradient(to right, #040E1E, #268DA4)',
                            }
                          : {}
                      }
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setSelectedOption('no')}
                      className={`flex-1 h-12 rounded-2xl font-semibold transition-all duration-200 ${
                        selectedOption === 'no'
                          ? 'text-white border-2 border-[#CB30E0]'
                          : 'bg-transparent text-gray-400 border-2 border-gray-600 hover:border-gray-500'
                      }`}
                      style={
                        selectedOption === 'no'
                          ? {
                              background: 'linear-gradient(to right, #040E1E, #bb3ed9)',
                            }
                          : {}
                      }
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Voting Status Prediction */}
                <div className="mb-8">
                  <div className="text-[#58C0CE] text-base font-medium mb-4">
                    Voting Status Prediction
                  </div>
                  <GradientSlider
                    leftPercentage={predictionYesPercentage}
                    rightPercentage={predictionNoPercentage}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-center">
                      <div className="text-[#00B2FF] text-lg font-semibold">
                        {predictionYesPercentage}%
                      </div>
                      <div className="text-white text-sm">Yes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#FF2DDF] text-lg font-semibold">
                        {predictionNoPercentage}%
                      </div>
                      <div className="text-white text-sm">No</div>
                    </div>
                  </div>
                </div>

                {/* Amount 输入 */}
                <div className="mb-6">
                  <div className="text-[#58C0CE] text-base font-medium mb-4">
                    Amount
                  </div>
                  <div className="relative">
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      className="w-full"
                      classNames={{
                        input: 'bg-transparent text-white text-right text-3xl font-semibold pr-4',
                        inputWrapper:
                          'bg-transparent border-2 border-[#07B6D4] rounded-2xl h-16',
                      }}
                      startContent={
                        <span className="text-white text-2xl font-semibold pl-4">
                          $
                        </span>
                      }
                    />
                  </div>
                </div>

                {/* Payout if you win */}
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-base">Payout if you win</span>
                    <span className="text-white text-lg font-semibold">
                      ${payoutIfWin}
                    </span>
                  </div>
                </div>

                {/* Join 按钮 */}
                <div className="mt-auto flex justify-end">
                  <div
                    className="w-[168px] h-[56px] rounded-2xl p-[2px]"
                    style={{
                      background:
                        'linear-gradient(to right, #1FA2FF, #12D8FA, #870CD8)',
                    }}
                  >
                    <button
                      className="w-full h-full rounded-2xl bg-[#0B041E] text-white font-semibold text-lg hover:opacity-80 transition-all duration-200"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
