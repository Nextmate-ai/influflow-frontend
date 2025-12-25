'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { SharedHeader } from '@/components/layout/SharedHeader';
import { MobileBlocker } from '@/components/launchpad/MobileBlocker';
import { PageBackground } from '@/components/ui/page-background';
import { useAuthStore } from '@/stores/authStore';

export default function HomePage() {
  const { isAuthenticated, openLoginModal } = useAuthStore();

  return (
    <>
      {/* 移动端: 显示阻断页面 */}
      <div className="md:hidden">
        <MobileBlocker />
      </div>

      {/* 桌面端: 正常显示首页 */}
      <div className="relative hidden min-h-screen flex-col bg-transparent text-white md:flex">
      {/* 背景组件 */}
      <PageBackground containerClassName="z-0" />

      {/* 顶部导航栏 */}
      <SharedHeader />

      {/* 主体内容 */}
      <main className="relative z-10 min-h-screen flex-1 bg-transparent text-[white] sm:mx-3 sm:rounded-[12px]">
        <section className="relative z-10 px-4 py-12 text-center sm:px-8 md:p-[10%] lg:p-[15%]">
          {/* <BackgroundGradientAnimation
            containerClassName="absolute inset-0 -z-10 h-full w-full"
            interactive={true}
          /> */}
          <h1 className="min-h-[80px] text-[32px] leading-[40px] sm:min-h-[120px] sm:text-[48px] sm:leading-[60px] md:min-h-[100px] md:text-[65px] md:leading-[80px]">
            Turn opinions into assets
            {/* <br className="hidden md:block" /> In Your Own Voice */}
          </h1>
          <p className="mx-auto mt-4 w-full max-w-[590px] px-4 text-[16px] leading-[22px] sm:mt-6 sm:text-[18px] sm:leading-[24px] md:text-[20px] md:leading-[25px]">
            A platform where creators turn opinions into prediction markets and
            earn from fan participation.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4 md:mt-10 md:gap-6">
            {/* Launch app 按钮 */}
            <Link
              href="/launchpad"
              className="w-full max-w-[280px] rounded-[12px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] p-[2px] shadow-sm hover:opacity-90 sm:w-auto"
            >
              <div className="rounded-[10px] bg-[#161A42] px-6 py-2.5 sm:px-8">
                <span className="font-['Poppins'] text-[15px] font-normal text-[#F9FAFB] sm:text-[16px]">
                  Launch app
                </span>
              </div>
            </Link>

            {/* Go to Influxy 按钮 - 移动端隐藏 */}
            {isAuthenticated ? (
              <a
                href="https://influxy.xyz/home"
                className="hidden w-full max-w-[280px] rounded-[12px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] p-[2px] shadow-sm hover:opacity-90 sm:block sm:w-auto"
              >
                <div className="rounded-[10px] bg-[#161A42] px-6 py-2.5 sm:px-8">
                  <span className="font-['Poppins'] text-[15px] font-normal text-[#F9FAFB] sm:text-[16px]">
                    Go to Influxy
                  </span>
                </div>
              </a>
            ) : (
              <a
                href="https://influxy.xyz/home"
                className="hidden w-full max-w-[280px] cursor-pointer rounded-[12px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] p-[2px] shadow-sm hover:opacity-90 sm:block sm:w-auto"
              >
                <div className="rounded-[10px] bg-[#161A42] px-6 py-2.5 sm:px-8">
                  <span className="font-['Poppins'] text-[15px] font-normal text-[#F9FAFB] sm:text-[16px]">
                    Go to Influxy
                  </span>
                </div>
              </a>
            )}
          </div>
          {/* TODO: 跳转链接 */}
        </section>

        <section className="mx-auto px-4 pt-[30px] sm:px-8 md:px-[10%] lg:px-[15%]">
          <p className="mb-[12px] text-center text-[36px] font-medium italic sm:text-[48px] md:text-[56px]">
            Why Nextmate.fun
          </p>
          <p className="mx-auto mb-[40px] w-full max-w-[640px] px-4 text-center text-[16px] sm:mb-[60px] sm:text-[18px] md:mb-[80px] md:text-[20px]">
            Empowering creators to turn opinions into value.
          </p>

          <Feature
            image="/home/ForKol.png"
            title="For KOL Creators"
            description="Use Influxy AI Agent to quickly craft high-quality posts and instantly create prediction events from your opinions. Fans can bet on your predictions, and you earn a share of the trading fees from the market."
            reversed={false}
            isAuthenticated={isAuthenticated}
            openLoginModal={openLoginModal}
          />

          <Feature
            image="/home/ForFan.png"
            title="For Fans"
            description="Join prediction markets created by your favorite KOLs, bet on opinions you believe in, and earn rewards when your predictions are right.  Transform your opinions into real value while engaging with creators you love. "
            reversed={true}
            isAuthenticated={isAuthenticated}
            openLoginModal={openLoginModal}
          />

          {/* <Feature
            image="/home/GetTheOutline.svg"
            title="Get the Outline"
            description="Influxy makes insights instantly translatable into clear outlines and deeper understanding. Generate narrative maps and accelerate growth through an intuitive mind-map tool."
            reversed={false}
            isAuthenticated={isAuthenticated}
            openLoginModal={openLoginModal}
          />

          <Feature
            image="/home/TrendingMadeSimple.svg"
            title="Trending Made Simple"
            description="Stay on top of what's trending, get hot topics, sample tweets, and ready-to-use titles to spark your next viral idea."
            reversed={true}
            isAuthenticated={isAuthenticated}
            openLoginModal={openLoginModal}
          /> */}
        </section>

        <section className="mx-auto px-4 py-12 pb-[60px] pt-[48px] text-center sm:px-8 sm:py-16 sm:pb-[80px] sm:pt-[56px] md:px-[10%] md:pb-[120px] md:pt-[72px] lg:px-[15%]">
          <p className="text-[32px] font-semibold italic sm:text-[36px] md:text-[40px]">
            Our Vision
          </p>
          <p className="mx-auto mt-12 w-full max-w-[780px] px-4 text-center text-[16px] sm:mt-16 sm:text-[18px] md:mt-20 md:text-[20px]">
            We're redefining how creators earn.Instead of relying on ads or
            agencies, creators can now turn their opinions into real value — by
            launching prediction events where fans engage, stake, and share
            rewards.
          </p>
          <p className="mx-auto mt-8 w-full max-w-[840px] px-4 text-center text-[16px] sm:text-[18px] md:mt-10 md:text-[20px]">
            A new era of socialized prediction markets, where expression itself
            becomes an asset.
          </p>
        </section>

        <section className="mx-auto min-h-[500px] px-4 pb-6 sm:min-h-[600px] sm:px-8 md:min-h-[722px] md:px-[10%] lg:px-[15%]">
          <p className="py-[48px] text-center text-[32px] font-semibold italic sm:py-[64px] sm:text-[36px] md:py-[80px] md:text-[40px]">
            FAQ
          </p>
          <div className="space-y-3">
            <FAQ q="What is Nextmate.fun?">
              Nextmate.fun is a platform where creators turn opinions into
              prediction events and earn from fan participation. Creators can
              publish articles, launch prediction events, and earn commissions.
              Fans can stake on events, express their views, and earn rewards
              for accurate predictions — creating a user-driven economy that
              rewards both creators and fans.
            </FAQ>
            <FAQ q="How to earn Nextmate.fun points? ">
              Points are earned by participating in prediction events, creating
              markets, subscribing to Influxy, and other engagement activities.
              These points will serve as a key reference for future token
              airdrops.
            </FAQ>
            <FAQ q="What is Influxy?">
              More than a writing tool, Influxy is an all-in-one AI workspace
              that models your unique style. It helps you work smarter, not
              harder — creating content that sounds like you, only sharper.
            </FAQ>
            <FAQ q="Who can use Influxy?">
              Influxy is designed for creators, influencers, researchers, and
              knowledge workers who want to turn their expertise and influence
              into lasting value.
            </FAQ>
            <FAQ q="How is Influxy different from other AI writing tools?">
              Unlike generic AI tools, Influxy learns your unique style and
              context. It doesn't just generate text — it helps you create
              authentic, branded content that truly sounds like you.
            </FAQ>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1a1f3a] via-[#2a3150] to-[#1a1f3a] px-4 py-12 sm:py-16">
          <p className="mb-6 text-center text-[32px] font-semibold italic text-white sm:mb-8 sm:text-[36px] md:text-[40px]">
            Team Background
          </p>
          <div className="relative mx-auto w-full">
            {/* Bing Ventures */}
            <div className="flex h-[100px] w-full items-center justify-center sm:h-[120px] md:h-[150px]">
              <Image
                src="/home/bing.png"
                alt="Team Background"
                width={150}
                height={120}
                className="h-[48px] w-auto sm:h-[60px] md:h-[72px]"
              />
            </div>

            {/* Team Members */}
            <div className="flex min-h-[120px] w-full flex-wrap items-center justify-center gap-4 py-4 sm:min-h-[140px] sm:gap-6 sm:py-0 md:min-h-[150px] md:gap-0">
              <Image
                src="/home/romeo.png"
                alt="Romeo"
                width={150}
                height={150}
                className="h-[70px] w-auto sm:h-[80px] md:h-[100px]"
              />

              <Image
                src="/home/jeff.png"
                alt="Jeff"
                width={150}
                height={150}
                className="h-[70px] w-auto sm:h-[80px] md:h-[100px]"
              />
              <Image
                src="/home/sing.png"
                alt="Sing"
                width={150}
                height={150}
                className="h-[70px] w-auto sm:h-[80px] md:h-[100px]"
              />
            </div>
          </div>
        </section>
      </main>
      </div>
    </>
  );
}

type FeatureProps = {
  image: string;
  title: string;
  description: string;
  reversed?: boolean;
  isAuthenticated: boolean;
  openLoginModal: () => void;
};

function Feature({
  image,
  title,
  description,
  reversed = false,
  isAuthenticated,
  openLoginModal,
}: FeatureProps) {
  const imageColClasses = `relative ${reversed ? 'md:order-2' : ''}`;
  const textColClasses = `${reversed ? 'md:ml-auto md:mr-8 lg:md:mr-[71px]' : 'md:mr-auto md:ml-8 lg:md:ml-[71px]'}`;

  return (
    <div className="mb-[48px] grid items-center gap-8 sm:mb-[64px] md:mb-[88px] md:grid-cols-2">
      <div className={imageColClasses}>
        <div className="size-full">
          <Image
            src={image}
            alt={title}
            width={1200}
            height={800}
            className="h-auto w-full"
          />
        </div>
      </div>

      <div className={`${textColClasses} w-full px-4 sm:w-auto sm:max-w-[350px] sm:px-0`}>
        <p className="text-[20px] font-semibold sm:text-[22px] md:text-[24px]">
          {title}
        </p>
        <p className="mt-2 text-[14px] leading-6 sm:mt-3 sm:text-[15px]">
          {description}
        </p>
        {/* <button
          className="mt-[24px] rounded-[12px] bg-black px-4 py-3 text-[14px] text-white"
          onClick={() => {
            if (isAuthenticated) {
              window.location.href = '/home';
            } else {
              openLoginModal();
            }
          }}
        >
          Try Now
        </button> */}
      </div>
    </div>
  );
}

type FAQProps = {
  q: string;
  children: React.ReactNode;
};

function FAQ({ q, children }: FAQProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className={`rounded-[20px] transition-all duration-300 ${
        isOpen
          ? 'border-0 bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] p-[2px]'
          : 'border border-[#252525]'
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <details
        className="
        group relative overflow-hidden
        rounded-[18px] bg-[#161A42]
        transition-all duration-300 hover:shadow-sm
      "
        open={isOpen}
      >
        <summary
          className="
        flex cursor-default list-none items-center justify-between
        py-6 pr-[40px] transition-[padding] duration-300 group-open:pb-4 sm:py-8 sm:pr-[48px] sm:group-open:pb-5 md:py-10 md:pr-[56px] md:group-open:pb-6
      "
          onClick={(e) => {
            // 阻止默认的点击切换行为
            e.preventDefault();
          }}
        >
          <span className="pl-[24px] text-[16px] font-medium italic sm:pl-[40px] sm:text-[18px] md:pl-[80px] md:text-[20px]">
            Q:
          </span>
          <span className="mr-auto pl-4 text-[16px] font-medium sm:pl-6 sm:text-[18px] md:pl-10 md:text-[20px]">
            {q}
          </span>
        </summary>

        {/* 关键：箭头相对 details 垂直居中 */}
        <img
          src="/icons/lsicon_down-outline.svg"
          width={16}
          height={16}
          className="
        pointer-events-none absolute right-[24px] top-1/2
        -translate-y-1/2 -rotate-90
        transition-transform
        group-open:rotate-0 sm:right-[32px] md:right-[40px]
      "
        />

        <div className="mb-6 flex w-full items-baseline px-4 text-sm leading-6 sm:mb-8 sm:px-0 sm:text-base sm:leading-7 md:mb-10 md:w-[820px]">
          <span className="pl-[24px] text-[16px] font-medium italic sm:pl-[40px] sm:text-[18px] md:pl-[80px] md:text-[20px]">
            A:
          </span>
          <div className="mr-auto pl-4 text-[16px] font-medium leading-6 sm:pl-6 sm:text-[18px] sm:leading-7 md:pl-10 md:text-[20px] md:leading-8">
            {children}
          </div>
        </div>
      </details>
    </div>
  );
}
