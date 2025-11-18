# 接入预测市场合约集成提案

## 概述

本提案旨在将前端应用与部署在 Base Sepolia 测试网上的预测市场智能合约集成，实现从链上读取市场数据并在首页预测列表中展示。

## 背景

- **合约地址**: `0x9e3696bb0b437ec91ed7c3b810788781214769f5`
- **网络**: Base Sepolia Testnet (Chain ID: 84532)
- **合约接口**: IPredictionMarket (参考: https://github.com/Nextmate-ai/social-prediction-market-contract)
- **当前状态**: 前端使用模拟数据 (MOCK_PREDICTIONS)
- **目标**: 使用 `useReadContract` 从链上读取真实市场数据

## 目标

1. **第一阶段**: 接入 `getMarket` 方法，读取单个市场数据
2. **替换模拟数据**: 将 `DashboardContent` 中的 `MOCK_PREDICTIONS` 替换为从合约读取的真实数据
3. **数据映射**: 将合约返回的数据结构映射到前端 `PredictionCardData` 接口

## 技术方案

### 1. 合约交互层

使用 thirdweb v5 的 `useReadContract` hook：
- 创建合约实例
- 调用 `getMarket(uint256 marketId)` 方法
- 处理加载状态和错误

### 2. 数据转换层

将合约返回的数据结构转换为前端所需格式：
- `config.questionTitle` → `title`
- `config.questionDescription` → `description`
- `data.yesPoolTotal` / `data.noPoolTotal` → `yesPercentage` / `noPercentage`
- `data.totalVolume` → `totalVolume`
- `config.endTime` → `timeRemaining`

### 3. 组件集成

在 `DashboardContent` 组件中：
- 使用 `useReadContract` 读取市场列表
- 处理多个市场的批量读取
- 显示加载状态
- 处理错误情况

## 影响范围

- **新增文件**:
  - `lib/contracts/predictionMarket.ts` - 合约配置和类型定义
  - `hooks/usePredictionMarkets.ts` - 市场数据读取 Hook
  - `utils/contractDataMapper.ts` - 数据转换工具

- **修改文件**:
  - `components/launchpad/dashboard/DashboardContent.tsx` - 集成合约数据
  - `constants/env.ts` - 添加合约地址常量

## 依赖

- thirdweb v5 SDK (已安装)
- @tanstack/react-query v5 (已安装)
- Base Sepolia 测试网配置

## 风险

1. **合约方法变更**: 如果合约接口发生变化，需要同步更新
2. **网络延迟**: 链上数据读取可能有延迟，需要适当的加载状态
3. **错误处理**: 需要处理合约调用失败的情况

## 后续计划

- 接入更多合约方法（创建市场、参与预测等）
- 实现实时数据更新
- 添加缓存机制优化性能

