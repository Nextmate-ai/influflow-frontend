# 预测市场合约集成 - 技术设计

## 架构设计

### 数据流

```
智能合约 (Base Sepolia)
    ↓
useReadContract Hook
    ↓
数据转换层 (contractDataMapper)
    ↓
前端组件 (DashboardContent)
    ↓
UI 展示 (PredictionCard)
```

### 组件层次

```
DashboardContent
  ├── usePredictionMarkets (Hook)
  │     ├── useReadContract (thirdweb)
  │     └── contractDataMapper
  └── AuctionGrid
        └── PredictionCard[]
```

## 实现细节

### 1. 合约配置

```typescript
// lib/contracts/predictionMarket.ts
import { getContract } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { createThirdwebClient } from 'thirdweb';

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

export const PREDICTION_MARKET_CONTRACT = getContract({
  client,
  chain: baseSepolia,
  address: PREDICTION_MARKET_CONTRACT_ADDRESS,
});
```

### 2. 类型定义

```typescript
// 合约返回的数据结构
interface MarketData {
  config: {
    questionTitle: string;
    questionDescription: string;
    creator: string;
    endTime: bigint;
  };
  data: {
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
  };
}
```

### 3. 数据映射

```typescript
// utils/contractDataMapper.ts
function mapMarketDataToPredictionCard(
  marketId: string,
  marketData: MarketData
): PredictionCardData {
  const yesTotal = Number(marketData.data.yesPoolTotal);
  const noTotal = Number(marketData.data.noPoolTotal);
  const total = yesTotal + noTotal;
  
  return {
    id: marketId,
    title: marketData.config.questionTitle,
    description: marketData.config.questionDescription,
    yesPercentage: total > 0 ? Math.round((yesTotal / total) * 100) : 50,
    noPercentage: total > 0 ? Math.round((noTotal / total) * 100) : 50,
    totalVolume: formatVolume(marketData.data.totalVolume),
    timeRemaining: calculateTimeRemaining(marketData.config.endTime),
    // ... 其他字段
  };
}
```

### 4. Hook 实现

```typescript
// hooks/usePredictionMarket.ts
export function usePredictionMarket(marketId: string) {
  const { data, isLoading, error } = useReadContract({
    contract: PREDICTION_MARKET_CONTRACT,
    method: "function getMarket(uint256 marketId) view returns (...)",
    params: [BigInt(marketId)],
  });

  const prediction = useMemo(() => {
    if (!data) return null;
    return mapMarketDataToPredictionCard(marketId, data);
  }, [data, marketId]);

  return { prediction, isLoading, error };
}
```

## 错误处理策略

1. **网络错误**: 显示友好的错误提示，允许重试
2. **合约调用失败**: 回退到模拟数据或显示空状态
3. **数据格式错误**: 使用默认值，记录错误日志

## 性能优化

1. **批量读取**: 使用 `Promise.all` 并行读取多个市场
2. **缓存**: 利用 React Query 的缓存机制
3. **分页**: 如果市场数量很多，实现分页加载

## 测试策略

1. **单元测试**: 测试数据映射函数
2. **集成测试**: 测试 Hook 和组件集成
3. **E2E 测试**: 测试完整的用户流程

