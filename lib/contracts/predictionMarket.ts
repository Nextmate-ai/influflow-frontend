/**
 * 预测市场合约配置
 * 使用 viem 进行合约交互
 * 网络: Base Sepolia Testnet (Chain ID: 84532)
 */

import { baseSepolia } from 'viem/chains';

import {
  PREDICTION_MARKET_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  FAUCET_CONTRACT_ADDRESS,
} from '@/constants/env';

/**
 * 预测市场合约 ABI
 * 仅包含需要使用的方法
 */
export const predictionMarketABI = [
  {
    type: 'function',
    name: 'getMarket',
    stateMutability: 'view',
    inputs: [{ name: 'marketId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'questionTitle', type: 'string' },
          { name: 'questionDescription', type: 'string' },
          { name: 'creator', type: 'address' },
          { name: 'endTime', type: 'uint256' },
        ],
      },
      {
        type: 'tuple',
        components: [
          { name: 'state', type: 'uint8' },
          { name: 'outcome', type: 'uint8' },
          { name: 'yesPoolTotal', type: 'uint256' },
          { name: 'noPoolTotal', type: 'uint256' },
          { name: 'yesSharesTotal', type: 'uint256' },
          { name: 'noSharesTotal', type: 'uint256' },
          { name: 'yesReserve', type: 'uint256' },
          { name: 'noReserve', type: 'uint256' },
          { name: 'k', type: 'uint256' },
          { name: 'baseVirtualLiquidity', type: 'uint256' },
          { name: 'virtualLiquidity', type: 'uint256' },
          { name: 'totalVolume', type: 'uint256' },
          { name: 'creatorFees', type: 'uint256' },
          { name: 'creatorFeesClaimed', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'buyShares',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'marketId', type: 'uint256' },
      { name: 'side', type: 'uint8' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'shares', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'createMarket',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'questionTitle', type: 'string' },
      { name: 'questionDescription', type: 'string' },
      { name: 'endTime', type: 'uint256' },
      { name: 'creatorSide', type: 'uint8' },
      { name: 'creatorBet', type: 'uint256' },
    ],
    outputs: [{ name: 'marketId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'estimatePayout',
    stateMutability: 'view',
    inputs: [
      { name: 'marketId', type: 'uint256' },
      { name: 'side', type: 'uint8' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [
      { name: 'shares', type: 'uint256' },
      { name: 'payout', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'claim',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'marketId', type: 'uint256' }],
    outputs: [{ name: 'amount', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'claimCreatorFees',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'marketId', type: 'uint256' }],
    outputs: [{ name: 'amount', type: 'uint256' }],
  },
] as const;

/**
 * ERC20 Token 合约 ABI
 */
export const erc20ABI = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

/**
 * Faucet 合约 ABI
 */
export const faucetABI = [
  {
    type: 'function',
    name: 'claim',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getTimeUntilNextClaim',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

/**
 * 合约配置对象
 */
export const predictionMarketContract = {
  address: PREDICTION_MARKET_CONTRACT_ADDRESS as `0x${string}`,
  abi: predictionMarketABI,
  chainId: baseSepolia.id,
} as const;

export const tokenContract = {
  address: TOKEN_CONTRACT_ADDRESS as `0x${string}`,
  abi: erc20ABI,
  chainId: baseSepolia.id,
} as const;

export const faucetContract = {
  address: FAUCET_CONTRACT_ADDRESS as `0x${string}`,
  abi: faucetABI,
  chainId: baseSepolia.id,
} as const;

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
