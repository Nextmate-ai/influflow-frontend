# 发射台（LaunchPad）模块实现指南

## 📋 项目结构概览

```
components/launchpad/
├── LaunchPadHeader.tsx              # 共享 Header 组件
├── types.ts                         # 类型定义
├── index.ts                         # 导出文件
├── dashboard/
│   ├── DashboardContent.tsx         # 仪表盘内容容器
│   ├── PredictionCard.tsx           # 预言卡片组件
│   └── AuctionGrid.tsx              # 网格布局容器
├── create/
│   ├── CreateForm.tsx               # 完整表单组件
│   ├── TitleInput.tsx               # 标题输入
│   ├── OptionsInput.tsx             # 选项输入
│   ├── DatePicker.tsx               # 日期选择
│   └── ActionButtons.tsx            # 操作按钮
├── participations/
│   ├── ParticipationsTable.tsx      # 表格容器
│   ├── ParticipationRow.tsx         # 表格行组件
│   └── ParticipationStats.tsx       # 统计信息
├── modals/
│   └── UserDetailModal.tsx          # 用户详情模态框
└── shared/
    ├── GradientSlider.tsx           # 渐变滑块
    └── StatCard.tsx                 # 统计卡片

app/launchpad/
├── page.tsx                         # 仪表盘首页 (/launchpad)
├── create/page.tsx                  # 创建页面 (/launchpad/create)
└── participations/page.tsx          # 参与历史 (/launchpad/participations)

hooks/
└── useLaunchPad.ts                  # 业务逻辑 Hooks
```

## 🎯 核心功能模块

### 1. **Dashboard（仪表盘）** - `/launchpad`

展示热门预言市场列表，用户可以查看预言并参与投注。

**组件树：**

```
LaunchPadHeader (showCreate=true)
└── DashboardContent
    ├── AuctionGrid
    │   └── PredictionCard (×6)
    │       └── GradientSlider
    └── UserDetailModal
```

**关键特性：**

- 3列响应式网格布局
- 卡片悬停效果（放大 + 边框发光）
- 渐变比例滑块展示投票情况
- 点击卡片打开详情模态框

### 2. **Create Page（创建页面）** - `/launchpad/create`

用户创建新的预言市场。

**组件树：**

```
CreateForm
├── TitleInput
├── OptionsInput
├── DatePicker
└── ActionButtons
    ├── Generate by Influxy
    ├── Save as Draft
    └── Create
```

**表单字段：**

- **标题**：预言问题
- **选项**：市场选项（最少2个，可添加）
- **截止时间**：投票截止时间
- **结果时间**：结果公布时间

### 3. **Participations Page（参与历史）** - `/launchpad/participations`

显示用户的参与和创建历史。

**组件树：**

```
LaunchPadHeader (showCreate=false)
└── ParticipationsTable
    ├── ParticipationStats
    └── Tabs
        ├── Participations Tab
        │   └── ParticipationRow (×4)
        └── Creations Tab
```

**表格列：**

- 预言标题
- 交易量
- 奖励
- 时间
- 状态（Ongoing / Finished）
- 结果（Yes / No / -）

## 🔌 集成指南

### 使用导出的组件

```typescript
// 导入单个组件
import { PredictionCard, CreateForm } from '@/components/launchpad';

// 或导入所有组件
import {
  LaunchPadHeader,
  DashboardContent,
  CreateForm,
  ParticipationsTable,
} from '@/components/launchpad';
```

### 使用 Hooks

```typescript
'use client';

import {
  useLaunchPadPredictions,
  useLaunchPadParticipations,
  useCreateMarket,
  useParticipateInMarket
} from '@/hooks/useLaunchPad';

// 在组件中使用
export function MyComponent() {
  const { predictions, isLoading, fetchPredictions } = useLaunchPadPredictions();

  return (
    // 你的组件逻辑
  );
}
```

### 类型定义

```typescript
import type {
  Prediction,
  Participation,
  CreateMarketFormData,
  PredictionCardData,
} from '@/components/launchpad/types';
```

## 🎨 设计系统

### 颜色方案

- **背景**：`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`
- **卡片**：`bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900`
- **是**：青色 `cyan-400` / `cyan-500`
- **否**：紫色 `violet-400` / `purple-500`
- **边框**：`border-slate-700`

### 常用类名集合

```css
/* Header 按钮 */
"bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"

/* 选中状态 */
"bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-2 border-cyan-400"

/* 非选中状态 */
"bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-500"
```

## 📡 API 集成点

当前代码中的 API 调用位置（已预留注释）：

1. **`useLaunchPad.ts`** - `useLaunchPadPredictions()`

   ```typescript
   // const response = await fetch('/api/launchpad/predictions');
   ```

2. **`useLaunchPad.ts`** - `useLaunchPadParticipations()`

   ```typescript
   // const response = await fetch('/api/launchpad/participations');
   ```

3. **`useLaunchPad.ts`** - `useCreateMarket()`

   ```typescript
   // const response = await fetch('/api/launchpad/create', { ... });
   ```

4. **`useLaunchPad.ts`** - `useParticipateInMarket()`
   ```typescript
   // const response = await fetch('/api/launchpad/participate', { ... });
   ```

## 🔄 数据流示例

### 参与预言流程

```
用户在 PredictionCard 点击
  ↓
触发 onCardClick 回调
  ↓
DashboardContent 设置 selectedPrediction
  ↓
打开 UserDetailModal
  ↓
用户修改金额和选项
  ↓
点击 Trade 按钮
  ↓
调用 useParticipateInMarket hook
  ↓
发送 POST /api/launchpad/participate
  ↓
成功 → 关闭模态框并刷新列表
```

### 创建市场流程

```
用户填写 CreateForm
  ↓
点击 Create / Save as Draft / Generate by Influxy
  ↓
调用相应 API 端点
  ↓
返回结果
  ↓
重定向到 /launchpad 或保存草稿
```

## 🚀 导航集成

已在 `ProfileDropdown` 中添加了 Launch Pad 菜单项：

```typescript
const handleLaunchPad = () => {
  router.push('/launchpad');
};

// 在下拉菜单中
<DropdownItem key="launchpad" onClick={handleLaunchPad}>
  Launch Pad
</DropdownItem>
```

## 📱 响应式设计

所有组件都已配置响应式 Tailwind 类：

- **仪表盘网格**：

  ```
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  ```

- **表格**：
  - 桌面：完整表格显示
  - 移动：可能需要额外 CSS 处理（参考需求）

## 🎯 下一步优化

1. **连接真实 API**：替换 `useLaunchPad.ts` 中的 console.log 为实际的 API 调用
2. **添加加载动画**：在数据加载时显示骨架屏
3. **错误处理**：完善错误消息显示
4. **表单验证**：在 CreateForm 中添加更多验证
5. **图片优化**：替换示例头像为真实用户数据
6. **动画效果**：添加 Framer Motion 过渡动画
7. **性能优化**：使用 React.memo 优化卡片重渲染
8. **实时更新**：考虑使用 WebSocket 实时更新预言数据

## 📝 组件 Props 说明

### LaunchPadHeader

```typescript
interface LaunchPadHeaderProps {
  showCreate?: boolean; // 是否显示 Create 按钮
}
```

### PredictionCard

```typescript
interface PredictionCardProps {
  id: string;
  image: string;
  title: string;
  yesPercentage: number;
  noPercentage: number;
  totalVolume: string;
  timeRemaining: string;
  onCardClick?: (prediction: PredictionCardData) => void;
}
```

### UserDetailModal

```typescript
interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: {
    id: string;
    title: string;
    image: string;
    percentage: number;
    totalVolume: string;
    timeRemaining: string;
    option: string;
  };
}
```

## 🎓 学习路径

1. 首先查看 `app/launchpad/page.tsx` 了解页面结构
2. 然后深入 `components/launchpad/dashboard/DashboardContent.tsx` 理解状态管理
3. 研究 `components/launchpad/modals/UserDetailModal.tsx` 了解交互设计
4. 最后学习 `hooks/useLaunchPad.ts` 的 API 集成模式

## ✨ 特色功能

✅ 组件完全组件化
✅ 共享 Header 实现代码复用
✅ 梯度颜色系统保证视觉一致
✅ 渐变滑块提供独特交互体验
✅ 预留完整 API 集成接口
✅ 清晰的数据流和状态管理
✅ Tailwind CSS 响应式设计
✅ TypeScript 完整类型支持
✅ 易于扩展和维护的代码结构

---

**文档版本**：1.0
**最后更新**：2024年11月
**作者**：Claude Code Assistant
