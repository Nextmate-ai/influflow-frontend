'use client';

import { useMarketCreation } from '@/hooks/useMarketCreation';
import { Input, Modal, ModalContent } from '@heroui/react';
import React, { useMemo, useState } from 'react';
import { useActiveWallet } from 'thirdweb/react';

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
  const [selectedSide, setSelectedSide] = useState<1 | 2>(1); // 1 = Yes, 2 = No

  const wallet = useActiveWallet();
  const { approve, createMarket, isPending, currentStep, error } =
    useMarketCreation();

  // 将日期字符串转换为 Unix 时间戳（秒）
  const endTime = useMemo(() => {
    try {
      // 假设日期格式为 DD/MM/YYYY
      const [day, month, year] = closingDate.split('/');
      const date = new Date(`${year}-${month}-${day}`);
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
      console.error('金额转换错误:', error);
      return BigInt(0);
    }
  }, [bidAmount]);

  const handleCreate = async () => {
    if (!wallet) {
      alert('请先连接钱包');
      return;
    }

    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    if (!rules.trim()) {
      alert('请输入规则');
      return;
    }

    if (creatorBet === BigInt(0)) {
      alert('请输入投注金额');
      return;
    }

    if (endTime === BigInt(0)) {
      alert('请输入有效的结束时间');
      return;
    }

    try {
      // 准备创建市场参数
      const marketParams = {
        questionTitle: title,
        questionDescription: rules,
        endTime,
        creatorSide: selectedSide,
        creatorBet,
      };

      // 打印完整的创建市场参数
      console.log('=== 创建市场参数 ===');
      console.log('questionTitle:', marketParams.questionTitle);
      console.log('questionDescription:', marketParams.questionDescription);
      console.log('endTime:', marketParams.endTime.toString());
      console.log(
        'endTime (日期):',
        new Date(Number(marketParams.endTime) * 1000).toLocaleString(),
      );
      console.log('creatorSide:', marketParams.creatorSide);
      console.log('creatorBet (wei):', marketParams.creatorBet.toString());
      console.log(
        'creatorBet (hex):',
        '0x' + marketParams.creatorBet.toString(16),
      );
      console.log('creatorBet (ETH):', Number(marketParams.creatorBet) / 1e18);
      console.log('原始 bidAmount:', bidAmount);
      console.log(
        '完整参数对象:',
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

      // 第一步：Approve - 等待交易确认
      console.log('=== 开始 Approve ===');
      await approve(creatorBet);
      console.log('=== Approve 完成 ===');

      // 第二步：创建市场 - 等待交易确认
      console.log('=== 开始创建市场 ===');
      await createMarket(marketParams);
      console.log('=== 创建市场完成 ===');

      // 成功后关闭模态框
      if (currentStep === 'success') {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('创建市场失败:', err);
      alert(`创建失败: ${err instanceof Error ? err.message : '未知错误'}`);
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
                    Options (选择你的立场)
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedSide(1)}
                      className={`w-[100px] h-[52px] rounded-2xl text-white text-base font-medium transition-all duration-200 flex items-center justify-center ${
                        selectedSide === 1
                          ? 'bg-[#2DC3D9] border-2 border-[#2DC3D9]'
                          : 'bg-transparent border border-[#2DC3D9] hover:bg-[#2DC3D9]/10'
                      }`}
                    >
                      {option1}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSide(2)}
                      className={`w-[100px] h-[52px] rounded-2xl text-white text-base font-medium transition-all duration-200 flex items-center justify-center ${
                        selectedSide === 2
                          ? 'bg-[#D602FF] border-2 border-[#D602FF]'
                          : 'bg-transparent border border-[#D602FF] hover:bg-[#D602FF]/10'
                      }`}
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

                {/* 错误提示 */}
                {error && (
                  <div className="text-red-400 text-sm mb-2">
                    错误: {error.message || '未知错误'}
                  </div>
                )}

                {/* 状态提示 */}
                {currentStep === 'approving' && (
                  <div className="text-[#86FDE8] text-sm mb-2">正在授权...</div>
                )}
                {currentStep === 'creating' && (
                  <div className="text-[#86FDE8] text-sm mb-2">
                    正在创建市场...
                  </div>
                )}
                {currentStep === 'success' && (
                  <div className="text-green-400 text-sm mb-2">创建成功！</div>
                )}

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
                      disabled={isPending || !wallet}
                      className="w-full h-full rounded-2xl bg-[#0B041E] text-white font-semibold text-lg hover:opacity-80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending
                        ? currentStep === 'approving'
                          ? '授权中...'
                          : currentStep === 'creating'
                            ? '创建中...'
                            : '处理中...'
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
