// 优化 CSS 导入顺序，避免 Turbopack 热更新问题
// 将 @import 改为直接导入，减少热更新时的依赖链
import '../styles/fonts.css';
import '../styles/editor.css';
import '../styles/driverjs.css';
import '../styles/globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { MainLayout } from '@/components/layout/mainLayout';
import { Providers } from '@/components/layout/providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script async src="https://platform.twitter.com/widgets.js"></script>
      </head>
      <body className="font-poppins">
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
