'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@heroui/react';
import Image from 'next/image';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: {
    id: string;
    title: string;
    image: string;
    percentage: number;
    totalVolume: string;
    timeRemaining: string;
    option: string; // "Yes" or "No"
  };
}

/**
 * 用户详情模态框 - 显示预言市场详情和投注界面
 */
export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  prediction,
}) => {
  const [amount, setAmount] = useState('231');
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no'>(
    prediction.option.toLowerCase() as 'yes' | 'no'
  );

  const payoutIfWin = (parseFloat(amount) * 1.076).toFixed(2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" backdrop="blur" className="dark">
      <ModalContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700">
        {(onClose) => (
          <>
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
            >
              ✕
            </button>

            <ModalHeader className="flex flex-col gap-3 pb-0">
              {/* 用户头像和标题 */}
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-400 flex-shrink-0">
                  <Image
                    src={prediction.image}
                    alt={prediction.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-400 text-sm font-medium mb-1">Name</h3>
                  <p className="text-white text-lg font-semibold leading-tight">
                    {prediction.title}
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="gap-6 py-6">
              {/* 投票比例显示 */}
              <div className="space-y-4">
                <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${prediction.percentage}%` }}
                  />
                  <div
                    className="absolute right-0 top-0 h-full bg-gradient-to-l from-violet-500 to-purple-500"
                    style={{ width: `${100 - prediction.percentage}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-1 bg-white shadow-lg"
                    style={{ left: `${prediction.percentage}%`, transform: 'translateX(-50%)' }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-semibold">
                    {prediction.percentage}%
                  </span>
                  <span className="text-violet-400 font-semibold">
                    {100 - prediction.percentage}%
                  </span>
                </div>
              </div>

              {/* 选项按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOption('yes')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    selectedOption === 'yes'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-2 border-cyan-400'
                      : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setSelectedOption('no')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    selectedOption === 'no'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white border-2 border-violet-400'
                      : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  No
                </button>
              </div>

              {/* 投注金额输入 */}
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  Amount
                </label>
                <div className="relative">
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    className="w-full"
                    classNames={{
                      input: 'bg-transparent text-white text-right text-2xl font-semibold',
                      inputWrapper: 'bg-slate-800 border-2 border-cyan-400 rounded-lg',
                    }}
                    startContent={
                      <span className="text-slate-400 text-xl font-semibold">$</span>
                    }
                  />
                </div>
              </div>

              {/* 盈利信息 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyan-400">Payout if you win</span>
                  <span className="text-cyan-400 font-semibold text-lg">${payoutIfWin}</span>
                </div>
              </div>

              {/* 额外信息 */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Total Volume</p>
                  <p className="text-cyan-400 font-semibold">{prediction.totalVolume}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Time Remaining</p>
                  <p className="text-cyan-400 font-semibold">{prediction.timeRemaining}</p>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onClose}
                className="bg-slate-700 text-white hover:bg-slate-600"
              >
                Close
              </Button>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg"
              >
                Trade
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
