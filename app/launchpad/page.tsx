'use client';

import { useState } from 'react';

import { DashboardContent } from '@/components/launchpad/dashboard/DashboardContent';
import { ParticipationsTable } from '@/components/launchpad/participations/ParticipationsTable';
import { SharedHeader } from '@/components/layout/SharedHeader';

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
    <div className="min-h-screen bg-[#0B041E] pb-[32px] text-white">
        {currentView === 'dashboard' && (
          <SharedHeader
            className="my-0 py-[30px]"
            onProfileModalOpenChange={setIsProfileModalOpen}
            onParticipationsClick={handleParticipationsClick}
            onCreationsClick={handleCreationsClick}
          />
        )}
        {currentView === 'dashboard' ? (
          <div className="mx-auto max-w-[1440px] px-4 md:px-[64px]">
            <div className="my-[12px] text-center text-lg md:text-2xl text-white">
              Turn your opinions into earnings.
            </div>
            <DashboardContent />
          </div>
        ) : (
          <div className="h-screen flex flex-col">
            {/* 移动端顶部返回按钮 */}
            <div className="md:hidden flex items-center h-14 px-4 border-b border-[#60A5FA]/20 shrink-0">
              <button
                onClick={handleBackClick}
                className="flex items-center justify-center w-10 h-10 text-white transition-colors hover:text-[#60A5FA]"
              >
                <img
                  src="/icons/back-arrow.png"
                  alt="Back"
                  className="w-6 h-6"
                />
              </button>
            </div>

            {/* 导航标签和返回按钮 */}
            <div className="px-4 md:px-[64px] pt-4 md:pt-6 mb-4 md:mb-6 flex items-center justify-between">
              {/* 分段控制器样式的标签 */}
              <div className="flex items-center rounded-lg bg-[#31304A] p-1 rounded-[30px]">
                <button
                  onClick={() => setCurrentView('participations')}
                  className={`px-4 py-2 w-[50%] text-sm md:text-base w-[60vw] font-semibold transition-all rounded-[30px] flex-1 ${
                    currentView === 'participations'
                      ? 'bg-[#4A4966] text-white'
                      : 'bg-transparent text-gray-400'
                  }`}
                >
                  Participation
                </button>
                <button
                  onClick={() => setCurrentView('creations')}
                  className={`px-4 py-2 text-sm md:text-base font-semibold transition-all rounded-[30px] flex-1 ${
                    currentView === 'creations'
                      ? 'bg-[#4A4966] text-white'
                      : 'bg-transparent text-gray-400'
                  }`}
                >
                  Creations
                </button>
              </div>
              <button
                onClick={handleBackClick}
                className="hidden md:flex items-center gap-2 text-sm md:text-base text-white transition-colors hover:text-[#60A5FA]"
              >
                <svg
                  className="size-4 md:size-5"
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
            <div className="flex-1 px-4 md:px-[64px] pb-4 md:pb-6 overflow-hidden">
              <ParticipationsTable viewType={currentView} />
            </div>
          </div>
        )}
      </div>
  );
}
