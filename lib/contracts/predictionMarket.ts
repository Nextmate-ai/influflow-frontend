/**
 * 预测市场合约配置
 * 合约地址: 0x9e3696bb0b437ec91ed7c3b810788781214769f5
 * 网络: Base Sepolia Testnet (Chain ID: 84532)
 */

import { getContract } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { createThirdwebClient } from 'thirdweb';
import { THIRDWEB_CLIENT_ID, PREDICTION_MARKET_CONTRACT_ADDRESS } from '@/constants/env';

// 创建 Thirdweb 客户端
const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

// 创建合约实例
export const predictionMarketContract = getContract({
  client,
  chain: baseSepolia,
  address: PREDICTION_MARKET_CONTRACT_ADDRESS,
});

/**
 * 市场数据结构（合约返回）
 */
export interface MarketConfig {
  questionTitle: string;
  questionDescription: string;
  creator: string;
  endTime: bigint;
}

export interface MarketData {
  state: number;
  outcome: number;
  yesPoolTotal: bigint;
  noPoolTotal: bigint;
  yesSharesTotal: bigint;
  noSharesTotal: bigint;
  yesReserve: bigint;
  noReserve: bigint;
  k: bigint;
  baseVirtualLiquidity: bigint;
  virtualLiquidity: bigint;
  totalVolume: bigint;
  creatorFees: bigint;
  creatorFeesClaimed: boolean;
}

export interface MarketResponse {
  config: MarketConfig;
  data: MarketData;
}

/**
 * getMarket 方法的完整签名
 */
export const GET_MARKET_METHOD =
  'function getMarket(uint256 marketId) view returns ((string questionTitle, string questionDescription, address creator, uint256 endTime) config, (uint8 state, uint8 outcome, uint256 yesPoolTotal, uint256 noPoolTotal, uint256 yesSharesTotal, uint256 noSharesTotal, uint256 yesReserve, uint256 noReserve, uint256 k, uint256 baseVirtualLiquidity, uint256 virtualLiquidity, uint256 totalVolume, uint256 creatorFees, bool creatorFeesClaimed) data)';

