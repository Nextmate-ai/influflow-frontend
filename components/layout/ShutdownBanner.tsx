'use client';

export function ShutdownBanner() {
  return (
    <div className="w-full bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
      <span>
        Influxy will be permanently shut down on{' '}
        <span className="font-semibold">March 31, 2026</span>. Please manage
        your subscription accordingly.
      </span>
      <span className="mx-2 text-amber-300">|</span>
      <span>
        Influxy 将于{' '}
        <span className="font-semibold">2026 年 3 月 31 日</span>{' '}
        正式关闭，请自行管理订阅。
      </span>
    </div>
  );
}
