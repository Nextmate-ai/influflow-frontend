'use client';

import { Input, Modal, ModalContent } from '@heroui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

import { useMarketCreation } from '@/hooks/useMarketCreation';
import { addToast } from '@/components/base/toast';

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
  const [closingDate, setClosingDate] = useState('');
  const [bidAmount, setBidAmount] = useState('0');
  const [selectedSide, setSelectedSide] = useState<1 | 2>(1); // 1 = Yes, 2 = No

  const { authenticated } = usePrivy();
  const router = useRouter();
  const { createMarketWithApproval, isPending, currentStep, error } =
    useMarketCreation();

  // 监听成功状态，自动关闭并跳转
  useEffect(() => {
    if (currentStep === 'success') {
      addToast({
        title: 'Success',
        description: 'Market created successfully!',
        color: 'success',
      });
      setTimeout(() => {
        onClose();
        router.push('/launchpad');
      }, 1500);
    }
  }, [currentStep, onClose, router]);

  // 监听错误状态，使用toast提示
  useEffect(() => {
    if (error && currentStep === 'error') {
      addToast({
        title: 'Error',
        description: error.message || 'Failed to create market',
        color: 'danger',
      });
    }
  }, [error, currentStep]);

  // 将日期字符串转换为 Unix 时间戳（秒）
  const endTime = useMemo(() => {
    try {
      if (!closingDate) {
        return BigInt(0);
      }
      // 支持 datetime-local 格式 (YYYY-MM-DDTHH:mm)
      const date = new Date(closingDate);
      if (isNaN(date.getTime())) {
        return BigInt(0);
      }
      return BigInt(Math.floor(date.getTime() / 1000));
    } catch {
      return BigInt(0);
    }
  }, [closingDate]);

  // 将 bidAmount 转换为 wei（18 位小数，精确转换避免浮点数精度问题）
  // 例如：输入 "1" → "1000000000000000000" (1后面18个0)
  const creatorBet = useMemo(() => {
    try {
      if (!bidAmount || bidAmount.trim() === '') {
        return BigInt(0);
      }

      // 移除所有空格和逗号
      const cleanAmount = bidAmount.replace(/[\s,]/g, '');

      // 检查是否为有效数字格式（支持纯整数和小数）
      // 匹配：纯整数（如 "1"）、小数（如 "1.5"、"0.1"）
      if (!/^\d+(\.\d+)?$/.test(cleanAmount)) {
        return BigInt(0);
      }

      // 按小数点分割
      const parts = cleanAmount.split('.');
      const integerPart = parts[0] || '0';
      let decimalPart = parts[1] || '';

      // 将小数部分补齐到18位，或截断到18位
      if (decimalPart.length > 18) {
        decimalPart = decimalPart.substring(0, 18);
      } else {
        decimalPart = decimalPart.padEnd(18, '0');
      }

      // 组合成完整的18位数字字符串
      // 例如：输入 "1" → integerPart="1", decimalPart="000000000000000000" → "1000000000000000000"
      const weiString = integerPart + decimalPart;

      // 转换为 BigInt（BigInt 会自动处理前导0）
      const result = BigInt(weiString);

      if (result <= BigInt(0)) {
        return BigInt(0);
      }

      return result;
    } catch (error) {
      console.error('Amount conversion error:', error);
      return BigInt(0);
    }
  }, [bidAmount]);

  const handleCreate = async () => {
    if (!authenticated) {
      addToast({
        title: 'Error',
        description: 'Please connect your wallet first',
        color: 'danger',
      });
      return;
    }

    if (!title.trim()) {
      addToast({
        title: 'Error',
        description: 'Please enter a title',
        color: 'danger',
      });
      return;
    }

    if (!rules.trim()) {
      addToast({
        title: 'Error',
        description: 'Please enter rules',
        color: 'danger',
      });
      return;
    }

    if (creatorBet === BigInt(0)) {
      addToast({
        title: 'Error',
        description: 'Please enter a bid amount',
        color: 'danger',
      });
      return;
    }

    if (endTime === BigInt(0)) {
      addToast({
        title: 'Error',
        description: 'Please enter a valid closing time',
        color: 'danger',
      });
      return;
    }

    try {
      // 准备创建市场参数
      const marketParams = {
        questionTitle: title,
        questionDescription: rules,
        endTime,
        creatorSide: selectedSide, // 1 = Yes, 2 = No
        creatorBet: creatorBet,
      };

      // 打印完整的创建市场参数
      console.log('=== 创建市场参数 ===');
      console.log('questionTitle:', marketParams.questionTitle);
      console.log('questionDescription:', marketParams.questionDescription);
      console.log('endTime:', marketParams.endTime.toString());
      console.log(
        'endTime (date):',
        new Date(Number(marketParams.endTime) * 1000).toLocaleString(),
      );
      console.log('creatorSide:', marketParams.creatorSide, selectedSide === 1 ? '(Yes)' : '(No)');
      console.log('creatorBet (wei):', marketParams.creatorBet.toString());
      console.log(
        'creatorBet (hex):',
        '0x' + marketParams.creatorBet.toString(16),
      );
      console.log('creatorBet (ETH):', Number(marketParams.creatorBet) / 1e18);
      console.log('Original bidAmount:', bidAmount);
      console.log(
        'Complete parameters object:',
        JSON.stringify(
          {
            ...marketParams,
            creatorBet: marketParams.creatorBet.toString(),
            endTime: marketParams.endTime.toString(),
          },
          null,
          2,
        ),
      );

      // 使用批量交易：一次性完成 Approve 和 CreateMarket
      // 用户只需签名一次，两笔交易原子性执行
      console.log('=== 开始批量交易（Approve + CreateMarket）===');
      await createMarketWithApproval(marketParams);
      console.log('=== 批量交易完成 ===');
    } catch (err) {
      console.error('Failed to create market:', err);
      // 错误已经在useEffect中通过toast处理
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      backdrop="blur"
      className="dark"
      hideCloseButton
      isDismissable={!isPending}
      isKeyboardDismissDisabled={isPending}
    >
      <ModalContent className="rounded-2xl border border-[#2DC3D9] bg-[#0B041E] p-0">
        {(onClose) => (
          <div className="relative flex flex-col">
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              disabled={isPending}
              className="cursor absolute right-6 top-6 z-10  text-[24px] font-light text-[#60A5FA] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ✕
            </button>

            <div className="p-8">
              {/* 标题 */}
              <div className="space-y-4">
                {/* Title 输入 */}
                <div>
                  <label className="mb-1 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-base font-medium text-transparent">
                    Title
                  </label>
                  <p className="mb-2 text-[12px] italic text-[#00D9F5]">
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
                  <label className="mb-1 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-base font-medium text-transparent">
                    Rules
                  </label>
                  <textarea
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    className="h-20 w-full resize-none rounded-2xl border border-[#2DC3D9] bg-transparent p-3 text-white transition-colors placeholder:text-gray-500 focus:border-[#2DC3D9] focus:outline-none"
                    placeholder="Define the rules for this prediction..."
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="mb-2 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-base font-medium text-transparent">
                    Options (Select your position)
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedSide(1)}
                      className={`flex h-[52px] w-[100px] items-center justify-center rounded-2xl text-base font-medium text-white transition-all duration-200 ${
                        selectedSide === 1
                          ? 'border-2 border-[#2DC3D9] bg-[#2DC3D9]'
                          : 'border border-[#2DC3D9] bg-transparent hover:bg-[#2DC3D9]/10'
                      }`}
                    >
                      {option1}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSide(2)}
                      className={`flex h-[52px] w-[100px] items-center justify-center rounded-2xl text-base font-medium text-white transition-all duration-200 ${
                        selectedSide === 2
                          ? 'border-2 border-[#D602FF] bg-[#D602FF]'
                          : 'border border-[#D602FF] bg-transparent hover:bg-[#D602FF]/10'
                      }`}
                    >
                      {option2}
                    </button>
                  </div>
                </div>

                {/* Prediction pool closing time */}
                <div>
                  <label className="mb-1 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-base font-medium text-transparent">
                    Prediction pool closing time
                  </label>
                  <Input
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    type="datetime-local"
                    className="w-full"
                    classNames={{
                      input:
                        'bg-transparent text-white text-base placeholder-gray-500',
                      inputWrapper:
                        'bg-transparent border border-[#2DC3D9] rounded-2xl hover:border-[#2DC3D9] focus-within:border-[#2DC3D9]',
                    }}
                  />
                </div>

                {/* Bid price */}
                <div>
                  <label className="mb-1 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-base font-medium text-transparent">
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
                      <span className="pl-4 text-2xl font-semibold text-white">
                        $
                      </span>
                    }
                    placeholder="0"
                  />
                </div>

                {/* 状态提示 */}
                {currentStep === 'approving' && (
                  <div className="mb-2 text-sm text-[#86FDE8]">Sending approval transaction...</div>
                )}
                {currentStep === 'waiting_approval' && (
                  <div className="mb-2 text-sm text-[#86FDE8]">
                    Waiting for approval confirmation... (Please do not close the window)
                  </div>
                )}
                {currentStep === 'creating' && (
                  <div className="mb-2 text-sm text-[#86FDE8]">
                    Creating market...
                  </div>
                )}

                {/* Create 按钮 */}
                <div className="flex justify-end pt-1">
                  <div
                    className="h-[56px] w-[168px] rounded-2xl p-[2px]"
                    style={{
                      background:
                        'linear-gradient(to right, #1FA2FF, #12D8FA, #870CD8)',
                    }}
                  >
                    <button
                      onClick={handleCreate}
                      disabled={isPending || !authenticated}
                      className="size-full rounded-2xl bg-[#0B041E] text-lg font-semibold text-white transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending
                        ? currentStep === 'approving'
                          ? 'Approving...'
                          : currentStep === 'waiting_approval'
                            ? 'Waiting...'
                            : currentStep === 'creating'
                              ? 'Creating...'
                              : 'Processing...'
                        : 'Create'}
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
