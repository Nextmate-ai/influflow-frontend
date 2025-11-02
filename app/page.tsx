'use client';

import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  const { isAuthenticated, openLoginModal, logout } = useAuthStore();

  return (
    <div className="flex min-h-screen flex-col bg-[#05020D] text-white">
      {/* 顶部导航栏 */}
      <div className="flex w-full items-center justify-between bg-[#05020D] my-[30px] px-[64px]">
        <img
          className="ml-3 h-[24px] w-auto"
          src={'/images/logo_white.png'}
          width={159}
          height={30}
        />

        <div className="flex text-white justify-center">
          <button
            className="mr-3 h-[55px] w-[116px] rounded-[5px] bg-[#252525] text-white "
            onClick={() => {
              if (isAuthenticated) {
                logout();
              } else {
                openLoginModal();
              }
            }}
          >
            {isAuthenticated ? 'Log Out' : 'Login'}
          </button>

          <div className="flex h-[55px] gap-[50px] leading-[55px]">
            <div className="cursor-pointer">About Us</div>

            <div className="cursor-pointer">Register</div>

            <div className="cursor-pointer">Contact</div>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <main className="mx-3 min-h-screen flex-1 rounded-[12px] bg-[#05020D] text-[white]">
        <section className="relative px-[15%] py-[18%] text-center z-10">
          {/* <BackgroundGradientAnimation
            containerClassName="absolute inset-0 -z-10 h-full w-full"
            interactive={true}
          /> */}
          <p className="text-[65px] h-[100px] leading-[80px]">
            Turn opinions into assets
            {/* <br className="hidden md:block" /> In Your Own Voice */}
          </p>
          <p className="mx-auto mt-6 w-[590px] text-[20px] leading-[25px]">
            A platform where creators turn opinions into prediction markets and
            earn from fan participation.
          </p>
          <div className="mt-10 flex justify-center">
            {isAuthenticated ? (
              <div className="flex flex-col items-center">
                <div className="rounded-[16px] mr-[12px] bg-gradient-to-r from-indigo-400 to-pink-400 px-8 py-3 text-[16px] font-medium text-white shadow-sm hover:opacity-90">
                  Coming Soon
                </div>
                <Link
                  className="rounded-[16px] h-[24px] mt-[20px] px-4 py-1 text-[12px] font-medium text-[#0000EE] hover:opacity-90"
                  href="/home"
                >
                  Go to Influxy
                </Link>
              </div>
            ) : (
              // <button
              //   className="rounded-[16px] bg-gradient-to-r from-indigo-400 to-pink-400 px-8 py-3 text-[16px] font-medium text-white shadow-sm hover:opacity-90"
              //   onClick={() => openLoginModal()}
              // >
              //   Get Started
              // </button>
              <div className="flex items-center">
                <div className="rounded-[16px] mr-[12px] p-[2px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] shadow-sm hover:opacity-90">
                  <div className="rounded-[14px] bg-[#161A42] px-8 py-3">
                    <span className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-[16px] font-medium text-transparent">
                      Coming Soon
                    </span>
                  </div>
                </div>
                <div
                  className="rounded-[16px] mr-[12px] bg-[#161A42] px-8 py-3 text-[16px] font-medium text-white shadow-sm hover:opacity-90 cursor-pointer"
                  onClick={() => openLoginModal()}
                >
                  Go to Influxy
                </div>
                {/* <button
                  className="rounded-[16px] h-[24px] mt-[20px] px-4 py-1 text-[12px] font-medium text-[#0000EE] hover:opacity-90"
                  onClick={() => openLoginModal()}
                >
                  Go to Influxy
                </button> */}
              </div>
            )}
          </div>
          {/* TODO: 跳转链接 */}
        </section>

        <section className="mx-auto px-[15%] pt-[30px]">
          <p className="mb-[12px] text-center text-[56px] font-medium italic ">
            Why Nextmate.fun
          </p>
          <p className="mx-auto mb-[80px] w-[640px] text-center text-[20px]">
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

        <section className="mx-auto px-[15%] py-16 pb-[120px] pt-[72px] text-center">
          <p className="text-[40px] font-semibold italic">Our Vision</p>
          <p className="mx-auto mt-20 text-center text-[20px] w-[780px]">
            We’re redefining how creators earn.Instead of relying on ads or
            agencies, creators can now turn their opinions into real value — by
            launching prediction events where fans engage, stake, and share
            rewards.
          </p>
          <p className="mx-auto mt-10 text-center text-[20px] w-[840px]">
            A new era of socialized prediction markets, where expression itself
            becomes an asset.
          </p>
        </section>

        <section className="mx-auto px-[15%] pb-6 min-h-[722px]">
          <p className="py-[80px] text-center text-[40px] font-semibold italic">
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

        <section className="mx-auto max-w-5xl px-4 py-16">
          <p className="mb-8 text-center text-[40px] font-semibold italic">
            Team Background
          </p>
          <div className="relative mx-auto w-full max-w-3xl">
            <div className="w-full h-[150px] flex items-center justify-center">
              <Image
                src="/home/bing.png"
                alt="Team Background"
                width={150}
                height={150}
                className="h-[100px] w-auto"
              />
            </div>

            <div className="w-full h-[150px] flex items-center justify-center">
              <Image
                src="/home/romeo.png"
                alt="Team Background"
                width={150}
                height={150}
                className="h-[100px] w-auto"
              />

              <Image
                src="/home/jeff.png"
                alt="Team Background"
                width={150}
                height={150}
                className="h-[100px] w-auto"
              />
              <Image
                src="/home/sing.png"
                alt="Team Background"
                width={150}
                height={150}
                className="h-[100px] w-auto"
              />
            </div>
            {/* <Image
              src="/home/TeamBg.jpg"
              alt="Team Background"
              width={1400}
              height={200}
            /> */}
          </div>
        </section>
      </main>
    </div>
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
  const textColClasses = `${reversed ? 'md:ml-auto md:mr-[71px]' : 'md:mr-auto md:ml-[71px]'}`;

  return (
    <div className="mb-[88px] grid items-center md:grid-cols-2">
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

      <div className={`${textColClasses} w-[350px]`}>
        <p className="text-[24px] font-semibold">{title}</p>
        <p className="mt-3 text-[14px] leading-5 ">{description}</p>
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
          ? 'border-0 p-[2px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]'
          : 'border border-[#252525]'
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <details
        className="
        group relative rounded-[18px]
        bg-[#161A42] hover:shadow-sm
        transition-all duration-300 overflow-hidden
      "
        open={isOpen}
      >
        <summary
          className="
        flex items-center cursor-default list-none justify-between
        pt-10 pb-10 group-open:pb-6 transition-[padding] duration-300
        pr-[56px]
      "
          onClick={(e) => {
            // 阻止默认的点击切换行为
            e.preventDefault();
          }}
        >
          <span className="text-[20px] font-medium pl-[80px] italic">Q:</span>
          <span className="text-[20px] font-medium mr-auto pl-10">{q}</span>
        </summary>

        {/* 关键：箭头相对 details 垂直居中 */}
        <img
          src="/icons/lsicon_down-outline.svg"
          width={16}
          height={16}
          className="
        absolute right-[40px] top-1/2 -translate-y-1/2
        rotate-[-90deg] group-open:rotate-0
        transition-transform
        pointer-events-none 
      "
        />

        <div className="text-sm leading-7 md:text-base flex items-baseline mb-10 w-[820px]">
          <span className="text-[20px] font-medium pl-[80px] italic">A:</span>
          <div className="text-[20px] font-medium mr-auto pl-10">
            {children}
          </div>
        </div>
      </details>
    </div>
  );
}
