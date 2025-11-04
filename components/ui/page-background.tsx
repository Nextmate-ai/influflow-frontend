'use client';

import { cn } from '@heroui/react';
import Image from 'next/image';

export const PageBackground = ({
  className,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        'absolute inset-0 w-full pointer-events-none overflow-hidden',
        containerClassName,
      )}
    >
      {/* 背景层：所有图片垂直依次展开 */}
      <div className="relative w-full h-full flex flex-col">
        {/* 图片1 */}
        <div className="relative w-screen h-auto shrink-0">
          <Image
            src="/home/1.png"
            alt="Background Layer 1"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
            sizes="100vw"
          />
        </div>

        {/* 图片2 */}
        <div className="relative w-screen h-auto shrink-0">
          <Image
            src="/home/2.png"
            alt="Background Layer 2"
            width={1920}
            height={1080}
            className="w-full h-auto"
            sizes="100vw"
          />
        </div>

        {/* 图片3 */}
        <div className="relative w-screen h-auto shrink-0">
          <Image
            src="/home/3.png"
            alt="Background Layer 3"
            width={1920}
            height={1080}
            className="w-full h-auto"
            sizes="100vw"
          />
        </div>

        {/* 图片4 */}
        <div className="relative w-screen h-auto shrink-0">
          <Image
            src="/home/4.png"
            alt="Background Layer 4"
            width={1920}
            height={1080}
            className="w-full h-auto"
            sizes="100vw"
          />
        </div>

        {/* 图片5 */}
        <div className="relative w-screen h-auto shrink-0">
          <Image
            src="/home/5.png"
            alt="Background Layer 5"
            width={1920}
            height={1080}
            className="w-full h-auto"
            sizes="100vw"
          />
        </div>

        {/* 延伸层：使用 flex-1 填充，通过 overflow-hidden 截断多余部分 */}
        <div className="relative w-screen flex-1 shrink-0 overflow-hidden" style={{ minHeight: 0 }}>
          <div className="absolute inset-0">
            <Image
              src="/home/5.png"
              alt="Background Extension"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
