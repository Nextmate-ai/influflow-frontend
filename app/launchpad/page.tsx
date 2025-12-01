import { Suspense } from 'react';

import { LaunchPadDashboardClient } from './LaunchPadDashboardClient';

/**
 * 发射台仪表盘主页（服务端入口）
 * 这里用 Suspense 包裹客户端组件，以满足 Next.js 对 useSearchParams 的要求
 */
export default function LaunchPadDashboardPage() {
  return (
    <Suspense fallback={null}>
      <LaunchPadDashboardClient />
    </Suspense>
  );
}

