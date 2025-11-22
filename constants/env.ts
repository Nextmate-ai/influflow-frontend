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

// Privy Configuration
export const PRIVY_APP_ID =
  process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
export const PRIVY_APP_SECRET =
  process.env.PRIVY_APP_SECRET || '';

// Contract Configuration
export const PREDICTION_MARKET_CONTRACT_ADDRESS =
  '0x04564470C8ee36dd24852E8837C97c4b12E507B8';
export const TOKEN_CONTRACT_ADDRESS =
  '0xC5387F42883F6AfBa3AA935764Ac79a112aE1897';
export const FAUCET_CONTRACT_ADDRESS =
  '0x74c80362E0c382C2550063294B38F8FC28947FAA';
export const BASE_SEPOLIA_CHAIN_ID = 84532;
