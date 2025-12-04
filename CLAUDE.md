# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

本仓库包含两个独立但共享基础设施的项目:

### 1️⃣ influxy - AI 内容创作工具
面向 KOL/创作者的 AI 内容创作与分发平台,提供从话题洞察、草案确认、流式生成、编辑优化到发布管理的一站式体验。

**核心功能:** 多模式 AI 生成 (Draft/Lite/Analysis)、富文本编辑 (TipTap)、Markdown/思维导图渲染、Twitter 集成、订阅积分系统、推荐系统

### 2️⃣ nextmate.fun - Web3 预测市场
基于区块链的预测市场平台,用户可以创建市场、购买份额、参与预测并获得收益。

**核心功能:** 预测市场创建管理、智能合约集成 (Wagmi + Viem)、钱包认证 (Privy)、份额交易和收益领取、操作员权限管理

### 共享基础设施
Next.js 15 App Router、Supabase 认证和数据库、Tailwind CSS + HeroUI 组件库、通用布局和 UI 组件

**⚠️ 重要提示**: 修改代码时请注意区分是 influxy 还是 nextmate.fun 的功能,避免混淆。

---

## 项目结构

```
influflow-frontend/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API Routes
│   │   ├── agent/               # [influxy] AI Agent SSE 流式 API
│   │   ├── twitter/             # [influxy] Twitter 内容生成 API
│   │   ├── upload/              # [influxy] 文件上传 API
│   │   ├── privy/               # [nextmate.fun] Privy 钱包集成 API
│   │   ├── proxy/               # [共享] 通用 REST API 代理
│   │   └── auth/                # [共享] 认证回调处理
│   ├── home/                     # [influxy] 首页路由
│   ├── subscription/            # [influxy] 订阅管理
│   ├── referral/                # [influxy] 推荐系统
│   ├── launchpad/               # [nextmate.fun] 预测市场页面
│   └── profile/                 # [共享] 用户资料

├── components/                   # React 组件 (约 90+ 文件)
│   ├── generation/              # [influxy] 生成编排核心 (3个)
│   ├── editorPro/               # [influxy] TipTap 富文本编辑器 (3个)
│   ├── Renderer/                # [influxy] 内容渲染系统 (27个)
│   ├── draft/                   # [influxy] 草稿确认组件 (5个)
│   ├── home/                    # [influxy] 首页组件 (7个)
│   ├── subscription/            # [influxy] 订阅组件 (10个)
│   ├── trending/                # [influxy] 趋势话题 (5个)
│   ├── referral/                # [influxy] 推荐系统 (3个)
│   ├── launchpad/               # [nextmate.fun] 预测市场组件 (25个)
│   ├── providers/               # [nextmate.fun] Privy Provider (1个)
│   ├── layout/                  # [共享] 布局组件 (15个)
│   ├── auth/                    # [共享] 认证组件 (4个)
│   ├── profile/                 # [共享] 个人资料 (4个)
│   ├── modals/                  # [共享] 全局弹窗 (2个)
│   └── ui/ & base/              # [共享] UI 组件 (8个)

├── hooks/                        # 自定义 Hooks (31个)
│   ├── [influxy] 生成相关 (5个)
│   │   useGenerationOrchestrator, useGenerationState, useArticleStreaming,
│   │   useDraftConfirmation, useAIEditing
│   ├── [influxy] 内容管理 (3个)
│   │   useContentManagement, useImageManagement, useMindmapInteraction
│   ├── [influxy] Twitter (5个)
│   │   useTwitterIntegration, useTweetThreads, useTweetThreadData,
│   │   useTweetHover, useCreatorXInfo
│   ├── [influxy] 聊天 (1个)
│   │   useChatStreaming
│   ├── [nextmate.fun] 预测市场 (6个)
│   │   usePredictionMarkets, useMarketCreation, useOperatorRole,
│   │   useResolveMarket, useLaunchPad, useUserParticipations
│   ├── [nextmate.fun] Web3 (7个)
│   │   useWalletAuth, useTokenApprove, useTokenBalance, useBuyShares,
│   │   useTokenClaim, useClaimPayout, useClaimCreatorFees
│   └── [共享] 工具 (4个)
│       useAsyncJob, usePerformanceMonitoring, useScrollOptimization, useProfileData

├── lib/                          # 核心工具库
│   ├── api/
│   │   ├── client.ts            # [共享] HTTP 客户端 (fetch 封装, 401重试, 积分检测)
│   │   ├── services.ts          # [共享] 业务 API 服务集合
│   │   ├── agent-chat.ts        # [influxy] SSE 流式聊天客户端
│   │   ├── article-generate.ts  # [influxy] 文章生成 API
│   │   └── referral.ts          # [influxy] 推荐系统 API
│   ├── supabase/                # [共享] Supabase 客户端
│   ├── contracts/               # [nextmate.fun] 智能合约集成
│   ├── markdown/                # [influxy] Markdown 解析
│   └── stripe.ts                # [influxy] Stripe 支付

├── stores/                       # Zustand 状态管理
│   ├── authStore.ts             # [共享] 认证状态
│   ├── subscriptionStore.ts     # [influxy] 订阅状态
│   ├── contentStore.ts          # [influxy] 内容编辑状态
│   └── articleStore.ts          # [influxy] 文章状态

├── types/                        # TypeScript 类型 (9个)
│   ├── api.ts                   # [共享] API 响应类型
│   ├── content.ts, generation.ts, agent-chat.ts, tweets.ts, draft.ts,
│   │   generate-stream.ts, outline.ts  # [influxy]
│   └── global.d.ts              # [共享] 全局类型

├── services/                     # 业务服务层
│   ├── GenerationModeManager.ts # [influxy] 生成模式管理
│   ├── mode-handlers/           # [influxy] 模式处理器 (工厂模式)
│   └── supabase-save.ts         # [共享] Supabase 保存

├── utils/                        # 工具函数 (11个)
├── config/                       # 配置文件
└── constants/                    # 常量定义
```

---

## 核心架构

### 环境与 API 代理

**本地环境使用 Next.js API Route 代理解决长耗时请求超时问题。**

- `NEXT_PUBLIC_ENV`: `local` | `test` | `production`
- 本地环境: 请求走 `/api/proxy/[...slug]` 代理到后端
- 测试/生产环境: 直接请求 `NEXT_PUBLIC_API_BASE_URL`

**关键代理路由:**
- `/api/proxy/[...slug]`: 通用 REST API 代理
- `/api/agent/chat/stream`: [influxy] SSE 流式聊天
- `/api/twitter/generate/stream`: [influxy] Twitter 内容生成
- `/api/privy/*`: [nextmate.fun] Privy 钱包集成

### 生成编排架构

**核心文件**: `components/generation/GenerationOrchestrator.tsx`

两阶段编排:
1. **草稿确认** (仅 draft 模式): `ChatDraftConfirmation` - 与 AI 对话确认草案
2. **内容生成**: `ArticleRenderer` - 执行生成和渲染

**生成模式** (`config/generation-modes.ts`):
- `draft`: 需要草稿确认,支持对话调整
- `lite`: 快速生成,直接输出
- `analysis`: 深度分析模式

### API 客户端与认证

**核心文件**: `lib/api/client.ts`

- **认证**: Supabase Auth, Token 由 `authStore.ts` 管理
- **401 自动重试**: 自动调用 `supabase.auth.refreshSession()` 刷新 Token
- **积分检测**: 响应 `code=42000` 时触发积分不足弹窗

**主要方法**: `apiGet/apiPost`, `apiGetData/apiPostData`, `apiDirectRequest`

### 状态管理

- **Zustand Stores**: `authStore`, `subscriptionStore`, `contentStore`, `articleStore`
- **React Query**: 异步数据获取、缓存和同步

### Supabase 集成

- **客户端**: `createClient()` - 浏览器端,自动处理 Cookie
- **服务端**: `createAdminClient()` - API Route 专用,需要 `SUPABASE_SERVICE_KEY`

### SSE 流式通信

**核心文件**: `lib/api/agent-chat.ts`

- 使用 `@microsoft/fetch-event-source` 实现
- 支持心跳、自动重连、完成态检测

---

## 技术栈

### 核心框架
- Next.js 15.3.4 (App Router + Turbopack)
- React 19.0.0
- TypeScript 5.x (strict 模式)

### 状态与数据
- Zustand 5.0.5 - 状态管理
- TanStack Query 5.74.4 - 异步数据
- Jotai 2.x - 原子化状态

### Web3 (nextmate.fun)
- Privy 3.8.0 - 钱包认证
- Wagmi 2.x - React Hooks for Ethereum
- Viem 2.x - TypeScript Ethereum 库
- RainbowKit 2.x - 钱包 UI

### UI 与样式
- Tailwind CSS 3.4.17
- HeroUI 2.7.6
- Lucide React - 图标
- Framer Motion 11.x - 动画

### 富文本 (influxy)
- TipTap 2.24.0 - 富文本编辑器
- Remark 11.x - Markdown 处理
- React Markdown 9.x

### 可视化
- ReactFlow 11.11.4 - 思维导图
- Recharts 2.x - 图表

### 后端集成
- Supabase 2.50.3 - 认证、数据库、存储
- Stripe 18.x - 支付
- @microsoft/fetch-event-source 2.0.1 - SSE

---

## 开发指南

### 常用命令

```bash
pnpm dev          # 启动开发服务器 (Turbopack)
pnpm build        # 生产构建
pnpm format       # 格式化: prettier + lint + tsc
pnpm lint         # ESLint 检查
pnpm tsc          # TypeScript 类型检查
```

### 环境变量

**必需:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ENV`
- `NEXT_PUBLIC_API_BASE_URL`

**服务端专用 (严禁暴露):**
- `SUPABASE_SERVICE_KEY`

### 代码规范

- TypeScript strict 模式
- ESLint + Prettier 统一风格
- Git 提交前自动 lint-staged
- 使用 React.memo 优化重渲染
- 长列表使用虚拟滚动

**⚠️ 重要：代码修改规范**
- **禁止使用 `pnpm lint --fix` 或类似命令直接修改代码**
- 只运行 `pnpm lint` 或 `pnpm tsc` 进行检查，不要自动修复
- 避免引入不相关的 lint 修改，保持提交的纯净性

### 安全考虑

- 敏感环境变量不暴露到客户端
- API 请求自动携带 Supabase Token
- 智能合约调用前检查余额和授权
- 用户输入使用 zod 验证

---

## 项目快速参考

### 如何识别代码属于哪个项目?

#### 📂 文件路径识别

**influxy 专属:**
- `app/home/`, `app/subscription/`, `app/referral/`, `app/article-tutorial/`
- `app/api/agent/`, `app/api/twitter/`, `app/api/upload/`, `app/api/auth/referral/`
- `components/generation/`, `components/editorPro/`, `components/Renderer/`, `components/draft/`
- `components/trending/`, `components/subscription/`, `components/referral/`
- `hooks/use*Generation*.ts`, `hooks/use*Article*.ts`, `hooks/use*Tweet*.ts`
- `lib/markdown/`, `lib/stripe.ts`, `lib/api/referral.ts`

**nextmate.fun 专属:**
- `app/launchpad/`
- `app/api/privy/`
- `components/launchpad/`, `components/providers/`
- `hooks/use*Market*.ts`, `hooks/use*Token*.ts`, `hooks/use*Buy*.ts`, `hooks/use*Claim*.ts`
- `lib/contracts/`

**共享部分:**
- `app/profile/`, `app/layout.tsx`, `app/page.tsx`
- `app/api/proxy/`, `app/api/auth/callback/`
- `components/layout/`, `components/auth/`, `components/ui/`, `components/base/`
- `lib/api/client.ts`, `lib/supabase/`, `lib/utils.ts`
- `stores/authStore.ts`

#### 🏷️ 功能特性识别

| 特性 | influxy | nextmate.fun | 共享 |
|------|---------|--------------|------|
| AI 内容生成 | ✅ | ❌ | ❌ |
| 富文本编辑 | ✅ | ❌ | ❌ |
| Twitter 集成 | ✅ | ❌ | ❌ |
| 订阅/积分 | ✅ | ❌ | ❌ |
| 推荐系统 | ✅ | ❌ | ❌ |
| 预测市场 | ❌ | ✅ | ❌ |
| Web3/钱包 | ❌ | ✅ | ❌ |
| 智能合约 | ❌ | ✅ | ❌ |
| Supabase Auth | ❌ | ❌ | ✅ |
| 布局系统 | ❌ | ❌ | ✅ |

### 修改代码时的注意事项

1. **修改 influxy 功能**:
   - 只关注 `[influxy]` 标记的文件
   - 测试访问 `/home`, `/subscription` 等页面
   - 确保不影响 nextmate.fun 功能

2. **修改 nextmate.fun 功能**:
   - 只关注 `[nextmate.fun]` 标记的文件
   - 测试访问 `/launchpad` 页面
   - 确保不影响 influxy 功能

3. **修改共享功能**:
   - 需要同时测试两个项目
   - 特别注意认证流程和 API 客户端

### 常见开发场景

**添加新 API 端点:**
1. 在 `lib/api/services.ts` 定义方法
2. 在 `types/api.ts` 定义类型
3. 创建对应 Hook
4. 在组件中使用

**添加新页面:**
1. 在 `app/` 下创建路由目录
2. 创建 `page.tsx`
3. 在 `components/` 下创建页面组件

**添加新状态:**
1. 在 `stores/` 下创建 store
2. 定义 state 和 actions
3. 使用 `useXxxStore()`

**添加智能合约交互:**
1. 在 `lib/contracts/` 添加 ABI
2. 创建 Hook 使用 Wagmi
3. 处理交易状态
4. 添加 Toast 提示

---

## 调试建议

- **代理/超时**: 本地环境确保使用 `/api/proxy`
- **Token 过期**: 401 错误会自动刷新,检查 Supabase 配置
- **图片上传**: 最大 10MB, 服务端使用 `SUPABASE_SERVICE_KEY`
- **积分不足**: `code=42000` 自动触发弹窗

---

最后更新: 2025-11-30

**维护建议:**
- 添加新功能时标注项目归属 ([influxy] / [nextmate.fun] / [共享])
- 大型重构前确认影响范围
- 建议使用不同 git 分支开发不同项目功能

**相关文档:**
- influxy: README.md
- nextmate.fun: LAUNCHPAD_*.md
