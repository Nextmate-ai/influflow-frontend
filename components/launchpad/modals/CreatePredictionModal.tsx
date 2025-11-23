'use client';

import { Input, Modal, ModalContent } from '@heroui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

import { useMarketCreation } from '@/hooks/useMarketCreation';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { addToast } from '@/components/base/toast';
import { CustomDatePicker } from '../shared/CustomDatePicker';

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * 创建预言市场模态框 - 用户可以创建新的预言市场
 * 重新设计，与整体设计风格保持一致
 */
export const CreatePredictionModal: React.FC<CreatePredictionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [rules, setRules] = useState('');
  const [option1, setOption1] = useState('Yes');
  const [option2, setOption2] = useState('No');
  const [closingDate, setClosingDate] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [selectedSide, setSelectedSide] = useState<1 | 2>(1); // 1 = Yes, 2 = No

  const { authenticated } = usePrivy();
  const router = useRouter();
  const { createMarketWithApproval, isPending, currentStep, error } =
    useMarketCreation();
  const { balance: tokenBalance } = useTokenBalance();

  // 监听成功状态，自动关闭并跳转
  useEffect(() => {
    if (currentStep === 'success') {
      addToast({
        title: 'Success',
        description: 'Market created successfully!',
        color: 'success',
      });
      onSuccess?.(); // 调用成功回调刷新数据
      setTimeout(() => {
        onClose();
        router.push('/launchpad');
      }, 1500);
    }
  }, [currentStep, onClose, router, onSuccess]);

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
  // 使用日期当天的 23:59:59 作为结束时间
  const endTime = useMemo(() => {
    try {
      if (!closingDate) {
        return BigInt(0);
      }
      // 支持 date 格式 (YYYY-MM-DD)，设置为当天的 23:59:59
      const date = new Date(closingDate);
      if (isNaN(date.getTime())) {
        return BigInt(0);
      }
      // 设置为当天的 23:59:59
      date.setHours(23, 59, 59, 999);
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

  // 最小下注金额：10 美元（转换为 wei）
  const MIN_BET_AMOUNT = BigInt(10 * 1e18); // 10 美元 = 10 * 10^18 wei

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

    // 检查最小下注金额：至少 10 美元
    if (creatorBet < MIN_BET_AMOUNT) {
      addToast({
        title: 'Error',
        description: 'Minimum bid amount is $10. Please enter at least $10',
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

    // 检查余额
    if (tokenBalance < creatorBet) {
      addToast({
        title: 'Error',
        description: `Insufficient balance. Required: ${(Number(creatorBet) / 1e18).toFixed(2)}, Current: ${(Number(tokenBalance) / 1e18).toFixed(2)}`,
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
      isDismissable={false}
      isKeyboardDismissDisabled={isPending}
      classNames={{
        wrapper: 'md:p-4 !p-0',
        base: 'md:max-w-[800px] md:max-h-[90vh] !m-0 !h-full md:!h-auto',
      }}
    >
      <ModalContent 
        className="rounded-none md:rounded-2xl bg-[#0B041E] p-0 h-full md:h-auto max-h-screen md:max-h-[90vh] overflow-y-auto"
        onClick={(e) => {
          // 如果点击的是日期选择器，不关闭 Modal
          const target = e.target as HTMLElement;
          if (target.closest('[data-date-picker]')) {
            e.stopPropagation();
          }
        }}
      >
        {(onClose) => (
          <div className="relative flex flex-col h-full">
            {/* 移动端顶部返回按钮区域 */}
            <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-[#2DC3D9]/20 shrink-0">
              <button
                onClick={onClose}
                disabled={isPending}
                className="flex items-center justify-center w-10 h-10 text-white transition-colors hover:text-[#60A5FA] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <img
                  src="/icons/back-arrow.png"
                  alt="Back"
                  className="w-6 h-6"
                />
              </button>
            </div>
            {/* 桌面端关闭按钮 */}
            <button
              onClick={onClose}
              disabled={isPending}
              className="hidden md:block absolute right-6 top-6 z-10 text-[24px] font-light text-[#60A5FA] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ✕
            </button>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {/* 标题 */}
              <div className="space-y-8 md:space-y-8">
                {/* Title 输入 */}
                <div>
                  <label className="mb-1 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-sm md:text-base font-medium text-transparent">
                    Title
                  </label>
                  <p className="mb-2 text-[10px] md:text-[12px] italic text-[#00D9F5]">
                    Ask something we can predict: Will Tesla's stock go up next
                    week?
                  </p>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                    classNames={{
                      input:
                        'bg-transparent text-white text-sm md:text-base placeholder-gray-500',
                      inputWrapper:
                        'bg-transparent border border-[#2DC3D9] rounded-2xl hover:border-[#2DC3D9] focus-within:border-[#2DC3D9] h-12 md:h-auto',
                    }}
                    placeholder="Enter your prediction question"
                  />
                </div>

                {/* Rules 输入 */}
                <div>
                  <label className="mb-1 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-sm md:text-base font-medium text-transparent">
                    Rules
                  </label>
                  <textarea
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    className="h-20 md:h-20 w-full resize-none rounded-2xl border border-[#2DC3D9] bg-transparent p-3 text-sm md:text-base text-white transition-colors placeholder:text-gray-500 focus:border-[#2DC3D9] focus:outline-none"
                    placeholder="Define the rules for this prediction..."
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="mb-2 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-sm md:text-base font-medium text-transparent">
                    Options (Select your position)
                  </label>
                  <div className="flex gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedSide(1)}
                      className={`flex h-[44px] md:h-[52px] flex-1 md:flex-initial md:w-[100px] items-center justify-center rounded-2xl text-sm md:text-base font-medium text-white transition-all duration-200 ${
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
                      className={`flex h-[44px] md:h-[52px] flex-1 md:flex-initial md:w-[100px] items-center justify-center rounded-2xl text-sm md:text-base font-medium text-white transition-all duration-200 ${
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
                  <label className="mb-1 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-sm md:text-base font-medium text-transparent">
                    Prediction pool closing time
                  </label>
                  <CustomDatePicker
                    value={closingDate}
                    onChange={setClosingDate}
                    placeholder="Select closing date"
                  />
                </div>

                {/* Bid price */}
                <div>
                  <label className="mb-1 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-sm md:text-base font-medium text-transparent">
                    Bid price
                  </label>
                  <Input
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    type="number"
                    step="0.01"
                    className="w-full"
                    classNames={{
                      input:
                        'bg-transparent text-white text-right text-2xl md:text-3xl font-semibold pr-4',
                      inputWrapper:
                        'bg-transparent border border-[#2DC3D9] rounded-2xl h-14 md:h-16',
                    }}
                    startContent={
                      <span className="pl-4 text-xl md:text-2xl font-semibold text-white">
                        $
                      </span>
                    }
                    placeholder="10"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Minimum bid amount: $10.00
                    {creatorBet > BigInt(0) && creatorBet < BigInt(10 * 1e18) && (
                      <span className="ml-2 text-red-400">
                        (Current: ${(Number(creatorBet) / 1e18).toFixed(2)})
                      </span>
                    )}
                  </p>
                </div>

                {/* Create 按钮 */}
                <div className="flex justify-end pt-1">
                  <div
                    className="h-[48px] md:h-[56px] w-full md:w-[168px] rounded-2xl p-[2px]"
                    style={{
                      background:
                        'linear-gradient(to right, #1FA2FF, #12D8FA, #870CD8)',
                    }}
                  >
                    <button
                      onClick={handleCreate}
                      disabled={isPending || !authenticated}
                      className="size-full rounded-2xl bg-[#0B041E] text-base md:text-lg font-semibold text-white transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
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
