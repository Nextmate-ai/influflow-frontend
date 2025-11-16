'use client';

import React, { useEffect } from 'react';
import { Modal, ModalContent } from '@heroui/react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParticipationsClick?: () => void;
  onCreationsClick?: () => void;
}

/**
 * 用户详情弹窗 - 显示用户信息和钱包
 * 重新设计为右侧抽屉式布局
 */
export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onParticipationsClick,
  onCreationsClick,
}) => {
  const { user } = useAuthStore();

  // 测试环境：默认钱包余额
  const walletBalance = '4,668';

  const handleParticipations = () => {
    onParticipationsClick?.();
    onClose();
  };

  const handleCreations = () => {
    onCreationsClick?.();
    onClose();
  };

  // 防止页面滚动
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      backdrop="transparent"
      className="dark"
      hideCloseButton
      isDismissable={false}
      classNames={{
        wrapper: 'justify-end items-center !overflow-hidden',
        base: 'm-0 !w-[400px] rounded-[12px] !static !transition-none',
        body: 'p-0',
        backdrop: 'hidden',
      }}
      style={{
        height: 'calc(100vh - 92px)',
      }}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            transition: {
              duration: 0,
            },
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0,
            },
          },
        },
      }}
    >
      <ModalContent 
        className="bg-transparent backdrop-blur-md border border-[#2DC3D9] rounded-[12px] p-0 overflow-hidden !transition-none"
        style={{ height: 'calc(100vh - 92px)' }}
      >
        {(onClose) => (
          <div className="flex flex-col relative h-full overflow-hidden">
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#60A5FA] cursor-pointer z-10 text-[24px] font-light hover:text-gray-300"
            >
              ✕
            </button>

            <div className="p-8 pt-16 h-full flex flex-col">
              {/* 标题 */}
              <h2 className="text-white text-2xl font-semibold mb-8 text-center">
                My Profile
              </h2>

              {/* 用户头像和姓名 */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#60A5FA] mb-4">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white text-2xl font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-white text-lg font-semibold">
                  {user?.name || 'User'}
                </h3>
              </div>

              {/* My Wallet 部分 */}
              <div className="mb-8">
                <h3 className="text-white text-base font-medium mb-4">
                  My Wallet
                </h3>
                <div className="flex items-center justify-between bg-transparent border border-[#2DC3D9] rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    {/* Ethereum 图标 */}
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                          fill="#627EEA"
                        />
                        <path
                          d="M12.498 3V9.6525L17.9955 12.165L12.498 3Z"
                          fill="white"
                          fillOpacity="0.602"
                        />
                        <path
                          d="M12.498 3L7 12.165L12.498 9.6525V3Z"
                          fill="white"
                        />
                        <path
                          d="M12.498 16.476V20.9963L18 12.8085L12.498 16.476Z"
                          fill="white"
                          fillOpacity="0.602"
                        />
                        <path
                          d="M12.498 20.9963V16.4753L7 12.8085L12.498 20.9963Z"
                          fill="white"
                        />
                        <path
                          d="M12.498 15.4298L17.9955 12.8085L12.498 9.65399V15.4298Z"
                          fill="white"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M7 12.8085L12.498 15.4298V9.65399L7 12.8085Z"
                          fill="white"
                          fillOpacity="0.602"
                        />
                      </svg>
                    </div>
                    <span className="text-white text-lg font-semibold">
                      {walletBalance} ETH
                    </span>
                  </div>
                  <button className="text-[#86FDE8] text-sm font-medium hover:text-[#60A5FA] transition-colors">
                    Add &gt;
                  </button>
                </div>
              </div>

              {/* My History 部分 */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-white text-base font-medium mb-4">
                  My History
                </h3>
                <div className="space-y-3 flex-1">
                  {/* Participations 按钮 */}
                  <button
                    onClick={handleParticipations}
                    className="w-full flex items-center gap-3 bg-transparent border border-[#2DC3D9] rounded-2xl p-4 hover:bg-[#2DC3D9]/10 transition-all duration-200"
                  >
                    {/* 复选框+时钟图标 */}
                    <div className="w-6 h-6 flex items-center justify-center relative">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient
                            id="participationsGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: '#86FDE8', stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: '#2DC3D9', stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        {/* 复选框外框 */}
                        <rect
                          x="4"
                          y="4"
                          width="12"
                          height="12"
                          rx="2"
                          stroke="url(#participationsGradient)"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        {/* 复选框勾选 */}
                        <path
                          d="M7 12L9.5 14.5L17 7"
                          stroke="url(#participationsGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* 时钟背景（在复选框下方） */}
                        <circle
                          cx="10"
                          cy="18"
                          r="4"
                          stroke="url(#participationsGradient)"
                          strokeWidth="1.5"
                          fill="none"
                          opacity="0.6"
                        />
                        <path
                          d="M10 15V18H13"
                          stroke="url(#participationsGradient)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.6"
                        />
                      </svg>
                    </div>
                    <span className="text-white text-base font-medium">
                      Participations
                    </span>
                  </button>

                  {/* Creations 按钮 */}
                  <button
                    onClick={handleCreations}
                    className="w-full flex items-center gap-3 bg-transparent border border-[#2DC3D9] rounded-2xl p-4 hover:bg-[#2DC3D9]/10 transition-all duration-200"
                  >
                    {/* 文档图标 */}
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient
                            id="creationsGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: '#86FDE8', stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: '#2DC3D9', stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                          stroke="url(#creationsGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <path
                          d="M14 2V8H20"
                          stroke="url(#creationsGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 13H16"
                          stroke="url(#creationsGradient)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8 17H16"
                          stroke="url(#creationsGradient)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white text-base font-medium">
                      Creations
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
