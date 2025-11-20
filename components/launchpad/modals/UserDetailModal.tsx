'use client';

import { Input, Modal, ModalContent } from '@heroui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useActiveWallet, useReadContract } from 'thirdweb/react';

import { useBuyShares } from '@/hooks/useBuyShares';
import { predictionMarketContract } from '@/lib/contracts/predictionMarket';

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
    rawData?: Record<string, any>; // 完整的原始数据
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
  const [amount, setAmount] = useState('0');
  // 防抖后的金额值，用于合约调用
  const [debouncedAmount, setDebouncedAmount] = useState('0');
  // 根据 prediction.option 设置初始选择，如果没有 option 则不选择
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(
    null,
  );

  // 下注相关状态
  const [operationError, setOperationError] = useState<Error | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 钱包和购买份额 hook
  const wallet = useActiveWallet();
  const { buySharesWithApproval, isPending, currentStep, error } =
    useBuyShares();

  // 当弹窗打开或 prediction 变化时，根据 option 设置初始选择
  useEffect(() => {
    if (isOpen) {
      if (prediction.option?.toLowerCase() === 'yes') {
        setSelectedOption('yes');
      } else if (prediction.option?.toLowerCase() === 'no') {
        setSelectedOption('no');
      } else {
        setSelectedOption(null);
      }
    }
  }, [isOpen, prediction.option]);

  // 防抖逻辑：输入完成后 500ms 再更新 debouncedAmount
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(amount);
    }, 500);

    return () => clearTimeout(timer);
  }, [amount]);

  // 当弹窗打开时，重置防抖状态
  useEffect(() => {
    if (isOpen) {
      setDebouncedAmount(amount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  // 计算合约调用参数（使用防抖后的金额）
  const debouncedAmountValue = parseFloat(debouncedAmount) || 0;
  const marketId = prediction.id ? BigInt(prediction.id) : BigInt(0);
  // 合约期望：yes = 1, no = 2
  const side = selectedOption === 'yes' ? 1 : selectedOption === 'no' ? 2 : 1;
  const amountInWei =
    debouncedAmountValue > 0
      ? BigInt(Math.floor(debouncedAmountValue * 1e18))
      : BigInt(0);

  // 调用合约方法获取真实的 payout 值
  // estimatePayout 返回 (uint256 shares, uint256 payout)
  const { data: payoutData, isPending: isPayoutPending } = useReadContract({
    contract: predictionMarketContract,
    method:
      'function estimatePayout(uint256 marketId, uint8 side, uint256 amount) view returns (uint256 shares, uint256 payout)',
    params: [marketId, side, amountInWei],
    queryOptions: {
      enabled:
        isOpen &&
        debouncedAmountValue > 0 &&
        selectedOption !== null &&
        marketId > BigInt(0),
    },
  });

  // 计算 payout 显示值（从 wei 转换为美元）
  // payoutData 是一个元组 [shares, payout]
  const [shares, payout] = payoutData || [BigInt(0), BigInt(0)];

  // 判断是否正在加载或输入中
  const amountValue = parseFloat(amount) || 0;
  const isInputting = amount !== debouncedAmount && amountValue > 0;
  const isCalculating = isPayoutPending && debouncedAmountValue > 0;

  // 显示逻辑：加载中显示 "..."，否则显示真实值或 "0.00"
  const payoutIfWin =
    isInputting || isCalculating
      ? '...'
      : payoutData && payout > BigInt(0)
        ? (Number(payout) / 1e18).toFixed(2)
        : '0.00';

  // 从 rawData 中获取真实数据
  const rawData = prediction.rawData || {};
  const rulesText = rawData.question_description || rawData.questionDescription || 'No description available.';
  const creator = rawData.creator || 'Unknown';

  // 提取数据源
  const yesInvestedRatio = rawData.yes_invested_ratio || rawData.yesInvestedRatio;
  const noInvestedRatio = rawData.no_invested_ratio || rawData.noInvestedRatio;
  const yesPrice = rawData.yes_price || rawData.yesPrice;
  const noPrice = rawData.no_price || rawData.noPrice;
  const yesPoolUsd = parseFloat(
    String(rawData.yes_pool_usd || rawData.yesPoolUsd || rawData.yes_pool_total || rawData.yesPoolTotal || 0)
  );
  const noPoolUsd = parseFloat(
    String(rawData.no_pool_usd || rawData.noPoolUsd || rawData.no_pool_total || rawData.noPoolTotal || 0)
  );
  const poolTotal = yesPoolUsd + noPoolUsd;

  // 计算百分比的辅助函数
  const calculatePercentage = (
    investedRatio: any,
    price: any,
    poolUsd: number,
    fallback: number
  ): number => {
    if (investedRatio !== undefined) {
      return parseFloat(String(investedRatio)) * 100;
    }
    if (price !== undefined) {
      return Math.round(parseFloat(String(price)) * 100);
    }
    if (poolTotal > 0) {
      return Math.round((poolUsd / poolTotal) * 100);
    }
    return fallback;
  };

  // 计算显示的百分比
  let realYesPercentage: number;
  let realNoPercentage: number;

  // 优先处理边界情况
  if (yesPoolUsd === 0 && noPoolUsd === 0) {
    realYesPercentage = 0;
    realNoPercentage = 0;
  } else if (noPoolUsd === 0) {
    realYesPercentage = 100;
    realNoPercentage = 0;
  } else if (yesPoolUsd === 0) {
    realYesPercentage = 0;
    realNoPercentage = 100;
  } else {
    // 正常情况：使用数据源计算
    realYesPercentage = calculatePercentage(yesInvestedRatio, yesPrice, yesPoolUsd, prediction.yesPercentage);
    realNoPercentage = calculatePercentage(noInvestedRatio, noPrice, noPoolUsd, prediction.noPercentage);
  }

  // 当弹窗打开时，清除错误和成功消息
  useEffect(() => {
    if (isOpen) {
      setOperationError(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  // 监听 error 状态变化
  useEffect(() => {
    if (error) {
      setOperationError(error);
    }
  }, [error]);

  // 使用批量交易：一次性完成 approve 和 buyShares
  const handleBuyShares = async () => {
    if (!wallet) {
      setOperationError(new Error('Wallet not connected'));
      return;
    }

    if (!selectedOption) {
      setOperationError(new Error('Please select Yes or No'));
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setOperationError(new Error('Please enter a valid amount'));
      return;
    }

    try {
      setOperationError(null);
      setSuccessMessage(null);

      // 转换参数
      const marketId = BigInt(prediction.id);
      // 合约期望：yes = 1, no = 2
      const side = selectedOption === 'yes' ? 1 : 2;
      const amountInWei = BigInt(Math.floor(amountValue * 1e18));

      console.log('=== 开始批量交易（Approve + BuyShares）===');

      // 使用批量交易
      await buySharesWithApproval({
        marketId,
        side,
        amount: amountInWei,
      });

      console.log('=== 批量交易完成 ===');
      setSuccessMessage('Successfully purchased shares!');
    } catch (err) {
      console.error('购买份额失败:', err);
      setOperationError(
        err instanceof Error ? err : new Error('Failed to buy shares'),
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      backdrop="blur"
      className="dark"
      hideCloseButton
    >
      <ModalContent className="rounded-2xl border border-[#60A5FA] bg-[#0B041E] p-0">
        {(onClose) => (
          <div className="relative flex h-full max-h-[75vh] flex-col">
            <div className="flex h-full flex-row overflow-hidden">
              {/* 左侧面板 - 预测详情 */}
              <div className="modal-left-scrollbar flex-1 overflow-y-auto border-r border-[#60A5FA] p-8">
                {/* 用户头像和Name */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/avatar_bg.png"
                      alt={prediction.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="max-w-[200px] truncate bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-base font-medium text-transparent">
                    {creator.slice(0, 6)}...{creator.slice(-4)}
                  </div>
                </div>

                {/* 预测问题 */}
                <h2 className="mb-6 text-2xl font-semibold leading-tight text-white">
                  {prediction.title}
                </h2>

                {/* 交易量和剩余时间 - 使用 StatCard */}
                <div className="mb-8 flex items-center gap-4">
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
                  <div className="mb-4 text-base font-medium text-white">
                    Voting Status:
                  </div>
                  <div className="relative h-10 w-full overflow-visible rounded-full">
                    {/* 左侧渐变条 */}
                    <div
                      className="absolute left-0 top-0 flex h-full items-center rounded-l-full bg-gradient-to-r from-[#00B2FF] to-[#00FFD0]"
                      style={{
                        width: `${realYesPercentage}%`,
                        zIndex: 1,
                      }}
                    >
                      <span
                        className="whitespace-nowrap text-sm font-medium text-white"
                        style={{
                          paddingLeft: '12px',
                          paddingRight: realYesPercentage < 20 ? '8px' : '12px',
                        }}
                      >
                        {yesInvestedRatio !== undefined
                          ? `${realYesPercentage.toFixed(1)}%`
                          : `${realYesPercentage}%`} Yes
                      </span>
                    </div>
                    {realNoPercentage > 0 && (
                      <div
                        className="absolute right-0 top-0 flex h-full items-center justify-end rounded-r-full bg-gradient-to-l from-[#870CD8] to-[#FF2DDF]"
                        style={{
                          width: `${realNoPercentage}%`,
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="whitespace-nowrap text-sm font-medium text-white"
                          style={{
                            paddingLeft: realNoPercentage < 20 ? '8px' : '12px',
                            paddingRight: '12px',
                          }}
                        >
                          {noInvestedRatio !== undefined
                            ? `${realNoPercentage.toFixed(1)}%`
                            : `${realNoPercentage}%`} No
                        </span>
                      </div>
                    )}
                    {realNoPercentage === 0 && (
                      <div className="absolute right-0 top-0 flex h-full items-center justify-end pr-3">
                        <span className="whitespace-nowrap text-sm font-medium text-white">
                          0% No
                        </span>
                      </div>
                    )}
                    {/* 闪电图标 - 在分割线中间 */}
                    <div
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${realYesPercentage}%`,
                        top: '50%',
                        zIndex: 3,
                      }}
                    >
                      <Image
                        src="/images/lightning.png"
                        alt="divider"
                        width={32}
                        height={32}
                        className="h-10 w-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* 规则部分 */}
                <div>
                  <div className="mb-4 text-base font-medium text-white">
                    Rules:
                  </div>
                  <div className="pr-2 text-sm leading-relaxed text-gray-400">
                    {rulesText}
                  </div>
                </div>
              </div>

              {/* 右侧面板 - My Bid */}
              <div className="flex flex-1 flex-col overflow-hidden p-8">
                {/* My Bid 标题和关闭按钮 */}
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-white">My Bid</h3>
                  <button
                    onClick={onClose}
                    className="text-2xl font-light text-white hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                {/* Vote for 选项 */}
                <div className="mb-8">
                  <div className="mb-4 text-base font-medium text-[#58C0CE]">
                    Vote for:
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedOption('yes')}
                      className={`h-12 rounded-2xl font-semibold transition-all duration-200 ${
                        selectedOption === 'yes'
                          ? 'border-2 border-[#07B6D4] text-white'
                          : 'border-2 border-gray-600 bg-transparent text-gray-400 hover:border-gray-500'
                      }`}
                      style={{
                        width: '102px',
                        ...(selectedOption === 'yes'
                          ? {
                              background:
                                'linear-gradient(to right, #040E1E, #268DA4)',
                            }
                          : {}),
                      }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setSelectedOption('no')}
                      className={`h-12 rounded-2xl font-semibold transition-all duration-200 ${
                        selectedOption === 'no'
                          ? 'border-2 border-[#CB30E0] text-white'
                          : 'border-2 border-gray-600 bg-transparent text-gray-400 hover:border-gray-500'
                      }`}
                      style={{
                        width: '102px',
                        ...(selectedOption === 'no'
                          ? {
                              background:
                                'linear-gradient(to right, #D245C3 0%, #5731AC 100%)',
                            }
                          : {}),
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Amount 输入 */}
                <div className="mb-6">
                  <div className="mb-4 text-base font-medium text-[#58C0CE]">
                    Amount
                  </div>
                  <div className="relative">
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      className="w-full"
                      classNames={{
                        input:
                          'bg-transparent text-white text-right text-3xl font-semibold pr-4',
                        inputWrapper:
                          'bg-transparent border-2 border-[#07B6D4] rounded-2xl h-16',
                      }}
                      startContent={
                        <span className="pl-4 text-2xl font-semibold text-white">
                          $
                        </span>
                      }
                    />
                  </div>
                </div>

                {/* Payout if you win */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-base text-white">
                      Payout if you win
                    </span>
                    <span className="text-lg font-semibold text-white">
                      ${payoutIfWin}
                    </span>
                  </div>
                </div>

                {/* 错误和成功提示 */}
                {operationError && (
                  <div className="mb-4 text-sm text-red-400">
                    {operationError.message}
                  </div>
                )}
                {successMessage && (
                  <div className="mb-4 text-sm text-green-400">
                    {successMessage}
                  </div>
                )}
                {/* 状态提示 */}
                {currentStep === 'processing' && (
                  <div className="mb-4 text-sm text-[#86FDE8]">
                    Sending Transaction...
                  </div>
                )}

                {/* Join 按钮 */}
                <div className="mt-auto flex flex-col items-end gap-2">
                  <div
                    className="h-[56px] w-[168px] rounded-2xl p-[2px]"
                    style={{
                      background:
                        'linear-gradient(to right, #1FA2FF, #12D8FA, #870CD8)',
                    }}
                  >
                    <button
                      onClick={handleBuyShares}
                      disabled={
                        !wallet ||
                        isPending ||
                        !selectedOption ||
                        parseFloat(amount) <= 0
                      }
                      className="size-full rounded-2xl bg-[#0B041E] text-lg font-semibold text-white transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending ? '处理中...' : 'Join'}
                    </button>
                  </div>
                  {!wallet && (
                    <span className="text-xs text-gray-400">
                      Please connect wallet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
