 'use client';

import Image from 'next/image';
import { useState } from 'react';

import { DashboardContent } from '@/components/launchpad/dashboard/DashboardContent';
import { ParticipationsTable } from '@/components/launchpad/participations/ParticipationsTable';
import { SharedHeader } from '@/components/layout/SharedHeader';

type ViewType = 'dashboard' | 'participations' | 'creations';

/**
 * 发射台仪表盘主页（客户端组件）
 * 显示热门预言市场和拍卖列表
 */
export function LaunchPadDashboardClient() {
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
    <div className="flex min-h-screen flex-col bg-[#0B041E] text-white">
      <SharedHeader
        className="my-0 shrink-0 pb-0 pt-[24px]"
        onProfileModalOpenChange={setIsProfileModalOpen}
        onParticipationsClick={handleParticipationsClick}
        onCreationsClick={handleCreationsClick}
      />
      {currentView === 'dashboard' ? (
        <div className="mx-auto w-full max-w-[1440px] flex-1 px-[20px] md:px-[40px]">
          <div className="my-[40px] md:[my-80px] text-center text-[24px] text-white md:text-[36px]">
            Turn your opinions into earnings.
          </div>
          <DashboardContent />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-[20px] md:px-[40px]">
          {/* 标题 */}
          <div className="my-[80px] shrink-0 text-center text-[24px] text-white md:text-[36px]">
            Turn your opinions into earnings.
          </div>

          {/* 导航标签和返回按钮 */}
          <div className="mb-4 flex shrink-0 items-center justify-between md:mb-6">
            {/* 移动端：分段控制器样式，PC端：简单文本按钮 */}
            <div className="flex items-center gap-6 rounded-[30px] bg-[#31304A] p-1 md:bg-transparent md:p-0">
              <button
                onClick={() => setCurrentView('participations')}
                className={`w-[60vw] flex-1 rounded-[30px] px-4 py-2 text-sm font-semibold transition-all md:w-auto md:flex-initial md:rounded-none md:p-0 md:text-base ${
                  currentView === 'participations'
                    ? 'bg-[#4A4966] text-white md:bg-transparent md:text-white'
                    : 'bg-transparent text-gray-400 md:text-gray-400'
                }`}
              >
                Participation
              </button>
              <button
                onClick={() => setCurrentView('creations')}
                className={`flex-1 rounded-[30px] px-4 py-2 text-sm font-semibold transition-all md:w-auto md:flex-initial md:rounded-none md:p-0 md:text-base ${
                  currentView === 'creations'
                    ? 'bg-[#4A4966] text-white md:bg-transparent md:text-white'
                    : 'bg-transparent text-gray-400 md:text-gray-400'
                }`}
              >
                Creations
              </button>
            </div>
            <button
              onClick={handleBackClick}
              className="hidden items-center gap-2 text-sm text-white transition-colors hover:text-[#60A5FA] md:flex md:text-base"
            >
              <Image
                src="/images/back.png"
                alt="Back"
                width={20}
                height={20}
                className="size-4 md:size-5"
              />
              <span>Back</span>
            </button>
          </div>

          {/* 内容区域 */}
          <div className="mb-[80px] flex min-h-0 flex-1 overflow-hidden rounded-2xl border-[3px] border-[#075985]">
            <ParticipationsTable viewType={currentView} />
          </div>
        </div>
      )}
    </div>
  );
}


