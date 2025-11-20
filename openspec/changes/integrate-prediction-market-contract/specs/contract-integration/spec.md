# 合约集成能力规范

## ADDED Requirements

### Requirement: REQ-CONTRACT-001 读取单个市场数据

系统 MUST 能够从智能合约读取单个预测市场的完整数据。

#### Scenario: 读取市场数据成功

- **Given**: 用户访问首页预测列表
- **When**: 系统调用 `getMarket(marketId)` 方法
- **Then**:
  - 合约返回市场配置和数据
  - 数据被正确映射到前端格式
  - UI 显示市场信息

#### Scenario: 处理加载状态

- **Given**: 合约调用正在进行
- **When**: `useReadContract` 返回 `isLoading: true`
- **Then**: UI 显示加载状态（骨架屏或加载指示器）

#### Scenario: 处理错误情况

- **Given**: 合约调用失败
- **When**: `useReadContract` 返回错误
- **Then**:
  - 显示友好的错误提示
  - 允许用户重试
  - 记录错误日志

### Requirement: REQ-CONTRACT-002 批量读取市场列表

系统 MUST 能够批量读取多个预测市场的数据。

#### Scenario: 读取多个市场

- **Given**: 需要显示 N 个市场
- **When**: 系统并行调用 N 次 `getMarket`
- **Then**:
  - 所有市场数据被正确读取
  - 数据按正确顺序显示
  - 性能满足要求（< 3秒）

#### Scenario: 部分市场读取失败

- **Given**: 批量读取多个市场
- **When**: 部分市场读取失败
- **Then**:
  - 成功读取的市场正常显示
  - 失败的市场显示错误状态
  - 不影响其他市场的显示

### Requirement: REQ-CONTRACT-003 数据格式转换

系统 MUST 将合约返回的数据格式转换为前端组件所需的格式。

#### Scenario: 转换市场数据

- **Given**: 合约返回原始数据
- **When**: 数据通过映射函数处理
- **Then**:
  - BigInt 值转换为可读字符串
  - 时间戳转换为相对时间
  - 百分比计算正确
  - 所有必需字段都有值

#### Scenario: 处理空值或无效数据

- **Given**: 合约返回空值或格式异常
- **When**: 数据映射函数处理
- **Then**:
  - 使用合理的默认值
  - 不抛出错误
  - UI 正常显示

### Requirement: REQ-CONTRACT-004 合约配置管理

系统 MUST 正确配置合约地址和网络。

#### Scenario: 使用正确的合约地址

- **Given**: 应用启动
- **When**: 创建合约实例
- **Then**:
  - 使用 Base Sepolia 测试网
  - 使用正确的合约地址
  - 合约实例创建成功

#### Scenario: 环境变量配置

- **Given**: 不同环境（开发/生产）
- **When**: 读取合约配置
- **Then**:
  - 从环境变量读取合约地址
  - 支持不同网络的配置
  - 配置验证通过

## MODIFIED Requirements

### Requirement: REQ-UI-001 预测列表数据源

系统 MUST 将数据源从模拟数据改为智能合约。

#### Scenario: 显示真实市场数据

- **Given**: 首页预测列表组件
- **When**: 组件加载
- **Then**:
  - 从合约读取真实数据
  - 不再使用 MOCK_PREDICTIONS
  - 数据实时反映链上状态
