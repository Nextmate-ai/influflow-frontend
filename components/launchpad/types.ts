/**
 * 发射台模块的类型定义
 */

/** 预言市场数据 */
export interface Prediction {
  id: string;
  image: string;
  title: string;
  yesPercentage: number;
  noPercentage: number;
  totalVolume: string;
  timeRemaining: string;
  createdAt?: Date;
  closingTime?: Date;
  resultTime?: Date;
}

/** 预言卡片点击事件数据 */
export interface PredictionCardData {
  id: string;
  title: string;
  image: string;
  percentage: number;
  totalVolume: string;
  timeRemaining: string;
  option: string;
}

/** 参与历史记录 */
export interface Participation {
  id: string;
  prediction: string;
  totalVolume: string;
  rewards: number;
  time: string;
  status: 'Ongoing' | 'Finished';
  outcome: 'Yes' | 'No' | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/** 创建市场表单数据 */
export interface CreateMarketFormData {
  title: string;
  options: string[];
  closingTime: string;
  resultTime: string;
}

/** 用户钱包信息 */
export interface UserWallet {
  address: string;
  balance: string;
  currency: string;
}

/** 市场统计信息 */
export interface MarketStats {
  totalEarnings: string;
  totalParticipations: number;
  totalCreations: number;
  winRate: number;
}
