'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { ThirdwebProvider } from 'thirdweb/react';
import { inAppWallet } from 'thirdweb/wallets';

import { DashboardContent } from '@/components/launchpad/dashboard/DashboardContent';
import { ParticipationsTable } from '@/components/launchpad/participations/ParticipationsTable';
import { SharedHeader } from '@/components/layout/SharedHeader';
import { THIRDWEB_CLIENT_ID } from '@/constants/env';

// 创建 Thirdweb 客户端
const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

// 配置只使用 In-App Wallet，只支持 X 登录
const wallets = [
  inAppWallet({
    auth: {
      options: ['x'],
    },
  }),
];

// 创建 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 分钟
    },
  },
});

type ViewType = 'dashboard' | 'participations' | 'creations';

/**
 * 发射台仪表盘主页
 * 显示热门预言市场和拍卖列表
 */
export default function LaunchPadDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleParticipationsClick = () => {
    setCurrentView('participations');
  };

  const handleCreationsClick = () => {
    setCurrentView('creations');
  };

  const handleBackClick = () => {
    setCurrentView('dashboard');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <div className="min-h-screen bg-[#0B041E] pb-[32px] text-white">
          <SharedHeader
            className="my-0 py-[30px]"
            onProfileModalOpenChange={setIsProfileModalOpen}
            onParticipationsClick={handleParticipationsClick}
            onCreationsClick={handleCreationsClick}
          />
          <div className="px-[64px]">
            <div className="my-[12px] text-center text-2xl text-white">
              Turn your opinions into earnings.
            </div>

            {currentView === 'dashboard' ? (
              <DashboardContent />
            ) : (
              <div>
                {/* 导航标签和返回按钮 */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex gap-8">
                    <button
                      onClick={() => setCurrentView('participations')}
                      className={`text-base font-semibold transition-colors ${
                        currentView === 'participations'
                          ? 'border-b-2 border-[#60A5FA] pb-2 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Participations
                    </button>
                    <button
                      onClick={() => setCurrentView('creations')}
                      className={`text-base font-semibold transition-colors ${
                        currentView === 'creations'
                          ? 'border-b-2 border-[#60A5FA] pb-2 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Creations
                    </button>
                  </div>
                  <button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 text-white transition-colors hover:text-[#60A5FA]"
                  >
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span>Back</span>
                  </button>
                </div>

                {/* 内容区域 */}
                <ParticipationsTable viewType={currentView} />
              </div>
            )}
          </div>
        </div>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
