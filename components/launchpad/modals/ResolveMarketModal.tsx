'use client';

import { Modal, ModalContent } from '@heroui/react';
import React, { useEffect, useRef, useState } from 'react';

import { addToast } from '@/components/base/toast';
import { useResolveMarket } from '@/hooks/useResolveMarket';

interface ResolveMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketId: string;
  marketTitle: string;
  onSuccess?: () => void;
}

/**
 * Resolve Market 确认弹窗
 * 仅在测试环境显示
 */
export const ResolveMarketModal: React.FC<ResolveMarketModalProps> = ({
  isOpen,
  onClose,
  marketId,
  marketTitle,
  onSuccess,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<1 | 2 | null>(null);
  const { resolveMarket, isPending, currentStep, error } = useResolveMarket();

  const successHandledRef = useRef(false);
  const errorHandledRef = useRef(false);

  // 监听成功状态
  useEffect(() => {
    if (currentStep === 'success') {
      if (successHandledRef.current) {
        return;
      }
      successHandledRef.current = true;

      addToast({
        title: 'Success',
        description: 'Market resolved successfully!',
        color: 'success',
      });
      onSuccess?.();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else if (successHandledRef.current) {
      successHandledRef.current = false;
    }
  }, [currentStep, onClose, onSuccess]);

  // 监听错误状态
  useEffect(() => {
    if (error && currentStep === 'error') {
      if (errorHandledRef.current) {
        return;
      }
      errorHandledRef.current = true;

      addToast({
        title: 'Error',
        description: error.message || 'Failed to resolve market',
        color: 'danger',
      });
    } else if (errorHandledRef.current && currentStep !== 'error') {
      errorHandledRef.current = false;
    }
  }, [error, currentStep]);

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setSelectedOutcome(null);
    }
  }, [isOpen]);

  const handleResolve = async () => {
    if (!selectedOutcome) {
      addToast({
        title: 'Error',
        description: 'Please select an outcome',
        color: 'danger',
      });
      return;
    }

    try {
      await resolveMarket({
        marketId: BigInt(marketId),
        outcome: selectedOutcome,
      });
    } catch (err) {
      console.error('Failed to resolve market:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      backdrop="blur"
      className="dark"
      hideCloseButton={false}
      isDismissable={!isPending}
      isKeyboardDismissDisabled={isPending}
      classNames={{
        backdrop: 'backdrop-blur-sm',
      }}
    >
      <ModalContent className="border-2 border-[#60A5FA] bg-[#0B041E] p-6">
        <div className="space-y-6">
          {/* 标题 */}
          <div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Resolve Market
            </h3>
            <p className="text-sm text-gray-400">
              {marketTitle}
            </p>
          </div>

          {/* 选择结果 */}
          <div>
            <div className="mb-3 text-sm font-medium text-[#58C0CE]">
              Select Outcome:
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOutcome(1)}
                disabled={isPending}
                className={`h-12 flex-1 rounded-2xl text-base font-semibold transition-all duration-200 ${
                  selectedOutcome === 1
                    ? 'border-2 border-[#07B6D4] text-white'
                    : 'border-2 border-gray-600 bg-transparent text-gray-400 hover:border-gray-500'
                } disabled:cursor-not-allowed disabled:opacity-50`}
                style={{
                  ...(selectedOutcome === 1
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
                onClick={() => setSelectedOutcome(2)}
                disabled={isPending}
                className={`h-12 flex-1 rounded-2xl text-base font-semibold transition-all duration-200 ${
                  selectedOutcome === 2
                    ? 'border-2 border-[#CB30E0] text-white'
                    : 'border-2 border-gray-600 bg-transparent text-gray-400 hover:border-gray-500'
                } disabled:cursor-not-allowed disabled:opacity-50`}
                style={{
                  ...(selectedOutcome === 2
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

          {/* 状态提示 */}
          {currentStep === 'resolving' && (
            <div className="text-center text-sm text-[#86FDE8]">
              Resolving market...
            </div>
          )}

          {/* 按钮 */}
          <div className="flex justify-end">
            <div
              className="h-12 w-full rounded-2xl p-[2px]"
              style={{
                background:
                  'linear-gradient(to right, #1FA2FF, #12D8FA, #870CD8)',
              }}
            >
              <button
                onClick={handleResolve}
                disabled={isPending || !selectedOutcome}
                className="size-full rounded-2xl bg-[#0B041E] text-base font-semibold text-white transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? 'Resolving...' : 'Resolve'}
              </button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
