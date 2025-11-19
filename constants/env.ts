export const isLocal = process.env.NEXT_PUBLIC_ENV === 'local';
export const isDev = process.env.NEXT_PUBLIC_ENV === 'test';
export const isProd = process.env.NEXT_PUBLIC_ENV === 'production';

export const API_HOST =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://influflow-api.up.railway.app'; // 测试/生产环境 ->直接请求后端环境
// 开发环境 -> next api 代理路由
export const API_BASE_URL = isLocal ? '/api/proxy' : API_HOST;

export const showEmailAuth =
  !isProd && process.env.NEXT_PUBLIC_EMAIL_AUTH_ENABLED === 'true';

export const enableArticleStreaming =
  process.env.NEXT_PUBLIC_ENABLE_ARTICLE_STREAMING === 'true';

// Thirdweb Configuration
export const THIRDWEB_CLIENT_ID =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
  'b5223df1a6e6f4c10c516b14d860dac2';
export const THIRDWEB_SECRET_KEY =
  process.env.THIRDWEB_SECRET_KEY ||
  'UTqTC0QPjc22oNnCARPJEgAiT3DIAkAoc_9SuXWawy2_KDv6SqEa4IPvpB49fbcI5ieQ9m2I_otxQr5Tiuemlg';

// Contract Configuration
export const PREDICTION_MARKET_CONTRACT_ADDRESS =
  '0x04564470C8ee36dd24852E8837C97c4b12E507B8';
export const BASE_SEPOLIA_CHAIN_ID = 84532;
