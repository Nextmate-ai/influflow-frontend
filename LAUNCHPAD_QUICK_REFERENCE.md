# LaunchPad 模块快速参考

## 📂 目录结构速览

```
✨ 新增文件：
components/launchpad/
├── LaunchPadHeader.tsx ...................... 共享顶部导航（2个页面使用）
├── types.ts .............................. 类型定义（预言、参与等）
├── index.ts ............................. 导出聚合文件
├── dashboard/
│   ├── DashboardContent.tsx .............. 仪表盘容器 (状态管理)
│   ├── PredictionCard.tsx ............... 卡片组件 (可复用)
│   └── AuctionGrid.tsx .................. 网格容器 (布局)
├── create/
│   ├── CreateForm.tsx ................... 完整表单
│   ├── TitleInput.tsx ................... 标题输入
│   ├── OptionsInput.tsx ................. 动态选项
│   ├── DatePicker.tsx ................... 日期选择
│   └── ActionButtons.tsx ................ 底部按钮组
├── participations/
│   ├── ParticipationsTable.tsx .......... 主表格组件
│   ├── ParticipationRow.tsx ............. 表格行 (复用)
│   └── ParticipationStats.tsx ........... 统计信息卡
├── modals/
│   └── UserDetailModal.tsx .............. 交互模态框
└── shared/
    ├── GradientSlider.tsx ............... 渐变比例滑块
    └── StatCard.tsx ..................... 统计卡片

app/launchpad/
├── page.tsx ............................ 🎯 /launchpad (首页)
├── create/page.tsx ..................... 🎯 /launchpad/create
└── participations/page.tsx ............. 🎯 /launchpad/participations

hooks/
└── useLaunchPad.ts ..................... 业务逻辑 & API 调用

顶部导航集成：
components/layout/sidebar/ProfileDropdown.tsx (已修改 +3 行)
```

## 🚀 3个核心页面

| 路由 | 文件 | 说明 |
|------|------|------|
| `/launchpad` | `app/launchpad/page.tsx` | 热门预言市场仪表盘 |
| `/launchpad/create` | `app/launchpad/create/page.tsx` | 创建新市场 |
| `/launchpad/participations` | `app/launchpad/participations/page.tsx` | 参与 & 创建历史 |

## 🎨 核心组件能力

### 高度复用的组件
- **PredictionCard** - 预言卡片（可配置所有数据）
- **ParticipationRow** - 表格行（可复用于不同表格）
- **GradientSlider** - 渐变滑块（独立使用）
- **StatCard** - 统计卡片（灵活显示任何统计）

### 容器组件
- **DashboardContent** - 管理预言列表和模态框状态
- **ParticipationsTable** - 管理表格和标签页
- **CreateForm** - 管理表单状态和验证

## 💡 使用示例

### 导入组件
```typescript
// 方式1：直接导入
import { PredictionCard } from '@/components/launchpad/dashboard/PredictionCard';

// 方式2：从主导出文件导入（推荐）
import { PredictionCard, CreateForm, UserDetailModal } from '@/components/launchpad';
```

### 导入 Hooks
```typescript
import { useLaunchPadPredictions, useParticipateInMarket } from '@/hooks/useLaunchPad';

const { predictions, fetchPredictions } = useLaunchPadPredictions();
```

### 导入类型
```typescript
import type { Prediction, Participation } from '@/components/launchpad/types';
```

## 🎯 API 接入清单

需要实现的 API 端点：

- `GET /api/launchpad/predictions` - 获取预言列表
- `GET /api/launchpad/participations` - 获取参与历史
- `POST /api/launchpad/create` - 创建市场
- `POST /api/launchpad/participate` - 参与投注

所有 API 调用位置已在 `hooks/useLaunchPad.ts` 中预留，搜索 `fetch` 即可找到。

## 📊 状态管理流

```
父组件 (DashboardContent)
  ├─ selectedPrediction (Local State)
  ├─ isModalOpen (Local State)
  └─ MOCK_PREDICTIONS (示例数据)
      └─ 传给 AuctionGrid
          └─ 传给 PredictionCard ×6
              └─ onCardClick 回调
                  └─ 更新父组件状态
                      └─ 打开 UserDetailModal
```

## 🎨 样式参考

所有组件使用 Tailwind CSS + 颜色变量：

```css
/* 主色方案 */
Primary: cyan-400/500 (是/确定)
Secondary: violet-400/purple-500 (否/取消)
Background: slate-900/800/700
Text: white/slate-300/slate-400

/* 常用组合 */
"bg-gradient-to-r from-cyan-500 to-blue-500"
"border-2 border-slate-700 hover:border-cyan-500"
"rounded-2xl overflow-hidden"
```

## ✅ 功能完成情况

- ✅ 组件化架构 (20+ 组件)
- ✅ 3个完整页面
- ✅ 共享 Header 组件
- ✅ 响应式设计 (grid-cols-1 md:2 lg:3)
- ✅ 模态框交互
- ✅ 表单管理
- ✅ 数据流设计
- ✅ 类型定义
- ✅ Hooks 业务逻辑
- ✅ 导航集成
- ⏳ API 集成 (待实现)
- ⏳ 表单验证 (待加强)
- ⏳ 错误处理 (待细化)

## 🔧 修改已有文件

**ProfileDropdown.tsx** (2个改动)
1. 添加 `handleLaunchPad()` 函数
2. 在下拉菜单中添加 "Launch Pad" 选项

## 📋 快速集成步骤

### 1️⃣ 连接 API
编辑 `hooks/useLaunchPad.ts`，替换 mock 数据为真实 API：
```typescript
// 搜索: "const response = await fetch"
// 替换注释的代码为实际的 fetch 调用
```

### 2️⃣ 替换示例数据
在各组件中，将 `MOCK_PREDICTIONS` 和 `MOCK_PARTICIPATIONS` 替换为从 hook 获取的数据

### 3️⃣ 添加表单验证
在 `CreateForm.tsx` 中完善验证逻辑

### 4️⃣ 测试
访问 `/launchpad` 查看仪表盘
访问 `/launchpad/create` 查看创建页面
访问 `/launchpad/participations` 查看历史页面

## 🎓 学习路径

1. **理解结构** → 打开 `LAUNCHPAD_GUIDE.md`
2. **查看首页** → `app/launchpad/page.tsx`
3. **研究容器** → `components/launchpad/dashboard/DashboardContent.tsx`
4. **学习交互** → `components/launchpad/modals/UserDetailModal.tsx`
5. **集成 API** → `hooks/useLaunchPad.ts`

## 🆘 常见问题

**Q: 如何修改颜色？**
A: 编辑 `tailwind.config.ts` 的 theme.extend.colors，或直接改组件的 Tailwind 类

**Q: 如何添加新卡片字段？**
A: 编辑 `Prediction` 接口，然后在 `PredictionCard` 中使用新字段

**Q: 如何连接数据库？**
A: 修改 `hooks/useLaunchPad.ts` 中的 fetch 调用，指向你的 API 端点

**Q: 预言卡片怎么响应式？**
A: 已在 `AuctionGrid.tsx` 配置了 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

**💡 Tips:** 所有组件都支持自定义 props，灵活度很高。需要修改样式时，直接编辑 Tailwind 类即可，无需改动 JSX 结构。
