import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 修复 Turbopack 在样式热更新时的崩溃问题
  // 这是一个已知的 Turbopack bug，当修改 Tailwind CSS 类名时会触发 panic
  // 解决方案：优化 CSS 导入方式或使用传统 webpack
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  experimental: {
    // Turbopack 配置
    turbo: {
      // 禁用某些可能导致 CSS 热更新崩溃的优化
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
        '.css',
      ],
    },
  },
};

export default nextConfig;
