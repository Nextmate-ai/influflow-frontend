# 接入预测市场合约 - 任务清单

## 1. 环境配置

- [ ] 1.1 在 `constants/env.ts` 中添加合约地址常量
  - [ ] 添加 `PREDICTION_MARKET_CONTRACT_ADDRESS`
  - [ ] 添加 `BASE_SEPOLIA_CHAIN_ID`

## 2. 合约配置和类型定义

- [ ] 2.1 创建合约配置文件
  - [ ] 创建 `lib/contracts/predictionMarket.ts`
  - [ ] 定义合约地址和 ABI
  - [ ] 定义 `getMarket` 方法的返回类型

- [ ] 2.2 创建合约实例工具函数
  - [ ] 使用 `getContract` 创建合约实例
  - [ ] 配置 Base Sepolia 网络

## 3. 数据转换层

- [ ] 3.1 创建数据映射工具
  - [ ] 创建 `utils/contractDataMapper.ts`
  - [ ] 实现 `mapMarketDataToPredictionCard` 函数
  - [ ] 处理数据格式转换（BigInt → string, timestamp → timeRemaining）

## 4. 合约读取 Hook

- [ ] 4.1 创建单个市场读取 Hook
  - [ ] 创建 `hooks/usePredictionMarket.ts`
  - [ ] 使用 `useReadContract` 调用 `getMarket`
  - [ ] 处理加载状态和错误

- [ ] 4.2 创建市场列表读取 Hook
  - [ ] 创建 `hooks/usePredictionMarkets.ts`
  - [ ] 实现批量读取多个市场
  - [ ] 处理市场 ID 列表

## 5. 组件集成

- [ ] 5.1 修改 `DashboardContent` 组件
  - [ ] 移除 `MOCK_PREDICTIONS`
  - [ ] 集成 `usePredictionMarkets` hook
  - [ ] 添加加载状态显示
  - [ ] 添加错误处理

- [ ] 5.2 更新 `PredictionCard` 类型定义
  - [ ] 确保类型与合约数据兼容
  - [ ] 添加可选字段处理

## 6. 测试和验证

- [ ] 6.1 测试合约读取功能
  - [ ] 验证单个市场数据读取
  - [ ] 验证多个市场批量读取
  - [ ] 测试错误处理

- [ ] 6.2 UI 测试
  - [ ] 验证加载状态显示
  - [ ] 验证数据正确映射和显示
  - [ ] 测试空数据情况

## 7. 文档

- [ ] 7.1 更新代码注释
  - [ ] 添加合约交互说明
  - [ ] 添加数据映射说明
