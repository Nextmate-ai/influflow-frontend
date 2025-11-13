'use client';

import { Input, Modal, ModalContent } from '@heroui/react';
import React, { useState } from 'react';

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 创建预言市场模态框 - 用户可以创建新的预言市场
 * 重新设计，与整体设计风格保持一致
 */
export const CreatePredictionModal: React.FC<CreatePredictionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState(
    "Will Michelle Yeoh win Best Actress at tomorrow's Oscars?",
  );
  const [rules, setRules] = useState(
    'The 2025 New York City mayoral election will be held on November 4, 2025, to elect the mayor of New York City.',
  );
  const [option1, setOption1] = useState('Yes');
  const [option2, setOption2] = useState('No');
  const [closingDate, setClosingDate] = useState('25/04/2026');
  const [bidAmount, setBidAmount] = useState('0');

  const handleCreate = () => {
    // TODO: 处理创建逻辑
    console.log({
      title,
      rules,
      options: [option1, option2],
      closingDate,
      bidAmount,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      backdrop="blur"
      className="dark"
      hideCloseButton
    >
      <ModalContent className="bg-[#0B041E] border border-[#2DC3D9] rounded-2xl p-0">
        {(onClose) => (
          <div className="flex flex-col relative">
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#60A5FA] cursor  z-10 text-[24px] font-light"
            >
              ✕
            </button>

            <div className="p-8">
              {/* 标题 */}
              <div className="space-y-4">
                {/* Title 输入 */}
                <div>
                  <label className="block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-transparent text-base font-medium mb-1">
                    Title
                  </label>
                  <p className="text-[#00D9F5] text-[12px] mb-2 italic">
                    Ask something we can predict: Will Tesla's stock go up next
                    week?
                  </p>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                    classNames={{
                      input:
                        'bg-transparent text-white text-base placeholder-gray-500',
                      inputWrapper:
                        'bg-transparent border border-[#2DC3D9] rounded-2xl hover:border-[#2DC3D9] focus-within:border-[#2DC3D9]',
                    }}
                    placeholder="Enter your prediction question"
                  />
                </div>

                {/* Rules 输入 */}
                <div>
                  <label className="block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-transparent text-base font-medium mb-1">
                    Rules
                  </label>
                  <textarea
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    className="w-full h-20 bg-transparent border border-[#2DC3D9] rounded-2xl text-white p-3 placeholder-gray-500 focus:outline-none focus:border-[#2DC3D9] transition-colors resize-none"
                    placeholder="Define the rules for this prediction..."
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-transparent text-base font-medium mb-2">
                    Options
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="w-[100px] h-[52px] bg-transparent border border-[#2DC3D9] rounded-2xl text-white text-base font-medium hover:bg-[#2DC3D9]/10 transition-all duration-200 flex items-center justify-center"
                    >
                      {option1}
                    </button>
                    <button
                      type="button"
                      className="w-[100px] h-[52px] bg-transparent border border-[#D602FF] rounded-2xl text-white text-base font-medium hover:bg-[#D602FF]/10 transition-all duration-200 flex items-center justify-center"
                    >
                      {option2}
                    </button>
                  </div>
                </div>

                {/* Prediction pool closing time */}
                <div>
                  <label className="block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-transparent text-base font-medium mb-1">
                    Prediction pool closing time
                  </label>
                  <Input
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    type="text"
                    className="w-full"
                    classNames={{
                      input:
                        'bg-transparent text-white text-base placeholder-gray-500',
                      inputWrapper:
                        'bg-transparent border border-[#2DC3D9] rounded-2xl hover:border-[#2DC3D9] focus-within:border-[#2DC3D9]',
                    }}
                    placeholder="DD/MM/YYYY"
                    endContent={
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    }
                  />
                </div>

                {/* Bid price */}
                <div>
                  <label className="block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-transparent text-base font-medium mb-1">
                    Bid price
                  </label>
                  <Input
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    type="number"
                    className="w-full"
                    classNames={{
                      input:
                        'bg-transparent text-white text-right text-3xl font-semibold pr-4',
                      inputWrapper:
                        'bg-transparent border border-[#2DC3D9] rounded-2xl h-16',
                    }}
                    startContent={
                      <span className="text-white text-2xl font-semibold pl-4">
                        $
                      </span>
                    }
                    placeholder="0"
                  />
                </div>

                {/* Create 按钮 */}
                <div className="pt-1 flex justify-end">
                  <div
                    className="w-[168px] h-[56px] rounded-2xl p-[2px]"
                    style={{
                      background:
                        'linear-gradient(to right, #1FA2FF, #12D8FA, #870CD8)',
                    }}
                  >
                    <button
                      onClick={handleCreate}
                      className="w-full h-full rounded-2xl bg-[#0B041E] text-white font-semibold text-lg hover:opacity-80 transition-all duration-200"
                    >
                      Create
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
