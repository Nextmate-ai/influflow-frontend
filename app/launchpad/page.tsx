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
            <div className="my-[12px] text-center text-lg text-white md:text-2xl">
              Turn your opinions into earnings.
            </div>
            <DashboardContent />
          </div>
        ) : (
          <div className="flex h-screen flex-col">
            {/* 移动端顶部返回按钮 */}
            <div className="flex h-14 shrink-0 items-center border-b border-[#60A5FA]/20 px-4 md:hidden">
              <button
                onClick={handleBackClick}
                className="flex size-10 items-center justify-center text-white transition-colors hover:text-[#60A5FA]"
              >
                <img
                  src="/icons/back-arrow.png"
                  alt="Back"
                  className="size-6"
                />
              </button>
            </div>

            {/* 导航标签和返回按钮 */}
            <div className="mb-4 flex items-center justify-between px-4 pt-4 md:mb-6 md:px-[64px] md:pt-6">
              {/* 分段控制器样式的标签 */}
              <div className="flex items-center rounded-[30px] bg-[#31304A] p-1">
                <button
                  onClick={() => setCurrentView('participations')}
                  className={`w-[60vw] flex-1 rounded-[30px] px-4 py-2 text-sm font-semibold transition-all md:w-1/2 md:text-base ${
                    currentView === 'participations'
                      ? 'bg-[#4A4966] text-white'
                      : 'bg-transparent text-gray-400'
                  }`}
                >
                  Participation
                </button>
                <button
                  onClick={() => setCurrentView('creations')}
                  className={`flex-1 rounded-[30px] px-4 py-2 text-sm font-semibold transition-all md:text-base ${
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
                className="hidden items-center gap-2 text-sm text-white transition-colors hover:text-[#60A5FA] md:flex md:text-base"
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
            <div className="flex-1 overflow-hidden px-4 pb-4 md:px-[64px] md:pb-6">
              <ParticipationsTable viewType={currentView} />
            </div>
          </div>
        )}
      </div>
  );
}
