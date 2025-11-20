# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

InfluFlow 是一个面向 KOL/创作者的 AI 内容创作与分发平台。前端基于 Next.js 15 App Router 构建,提供从话题洞察、草案确认、流式生成、编辑优化到发布管理的一站式体验。

## 项目结构

```
influflow-frontend/
├── app/                          # Next.js 15 App Router 页面与路由
│   ├── api/                      # API Routes (服务端端点)
│   │   ├── agent/               # AI Agent 相关 API (SSE 流式)
│   │   ├── auth/                # 认证回调处理 (OAuth)
│   │   ├── proxy/               # 通用 REST API 代理
│   │   ├── twitter/             # Twitter 集成 API
│   │   └── upload/              # 文件上传 (Supabase Storage)
│   ├── home/                     # 首页路由
│   ├── launchpad/               # Launchpad (预测市场) 页面
│   ├── profile/                 # 用户个人资料页面
│   ├── referral/                # 推荐系统页面
│   ├── subscription/            # 订阅管理页面
│   ├── article-tutorial/        # 教程页面
│   ├── layout.tsx               # 根布局组件
│   └── page.tsx                 # 首页入口
│
├── components/                   # React 组件
│   ├── generation/              # 生成编排核心组件
│   │   └── GenerationOrchestrator.tsx  # 生成流程编排器
│   ├── editorPro/               # 富文本编辑器 (TipTap)
│   ├── Renderer/                # 内容渲染器 (Markdown/TipTap/Mindmap)
│   ├── launchpad/               # Launchpad 相关组件
│   ├── modals/                  # 全局弹窗组件
│   ├── auth/                    # 认证相关组件
│   ├── layout/                  # 布局组件
│   ├── ui/                      # 通用 UI 组件
│   ├── home/                    # 首页专用组件
│   ├── profile/                 # 个人资料组件
│   ├── subscription/            # 订阅相关组件
│   ├── trending/                # 趋势话题组件
│   ├── draft/                   # 草稿确认组件
│   └── base/                    # 基础组件
│
├── hooks/                        # 自定义 React Hooks
│   ├── useGenerationOrchestrator.ts  # 生成编排逻辑
│   ├── useGenerationState.ts         # 生成状态管理
│   ├── useDraftConfirmation.ts       # 草稿确认流程
│   ├── useArticleStreaming.ts        # 文章流式生成
│   ├── useChatStreaming.ts           # 聊天流式通信
│   ├── useAIEditing.ts               # AI 编辑功能
│   ├── useContentManagement.ts       # 内容管理
│   ├── useImageManagement.ts         # 图片管理
│   ├── useTweetThreads.ts            # Twitter 线程数据
│   ├── useTwitterIntegration.ts      # Twitter 集成
│   ├── usePredictionMarket.ts        # 预测市场核心
│   ├── usePredictionMarkets.ts       # 预测市场列表
│   ├── useMarketCreation.ts          # 市场创建
│   ├── useBuyShares.ts               # 购买份额
│   ├── useTokenApprove.ts            # Token 授权
│   ├── useTokenBalance.ts            # Token 余额
│   ├── useTokenClaim.ts              # Token 领取
│   ├── useWalletAuth.ts              # 钱包认证
│   └── useAsyncJob.ts                # 异步任务管理
│
├── lib/                          # 核心工具库
│   ├── api/                      # API 客户端
│   │   ├── client.ts            # HTTP 客户端 (fetch 封装)
│   │   └── agent-chat.ts        # SSE 流式通信客户端
│   ├── supabase/                # Supabase 集成
│   │   ├── client.ts            # 浏览器端客户端
│   │   └── server.ts            # 服务端客户端
│   ├── contracts/               # Web3 智能合约集成
│   ├── markdown/                # Markdown 解析与渲染
│   ├── data/                    # 数据处理工具
│   ├── stripe.ts                # Stripe 支付集成
│   └── utils.ts                 # 通用工具函数
│
├── stores/                       # Zustand 状态管理
│   ├── authStore.ts             # 认证状态 (用户/Token)
│   ├── subscriptionStore.ts     # 订阅状态 (积分/套餐)
│   ├── contentStore.ts          # 内容编辑状态
│   └── articleStore.ts          # 文章相关状态
│
├── types/                        # TypeScript 类型定义
│   ├── api.ts                   # API 响应类型
│   ├── content.ts               # 内容相关类型
│   ├── generation.ts            # 生成相关类型
│   ├── agent-chat.ts            # Agent 聊天类型
│   ├── tweets.ts                # Twitter 数据类型
│   ├── draft.ts                 # 草稿类型
│   └── global.d.ts              # 全局类型声明
│
├── config/                       # 配置文件
│   └── generation-modes.ts      # 生成模式配置
│
├── constants/                    # 常量定义
│   ├── env.ts                   # 环境变量配置
│   └── ...                      # 其他常量
│
├── utils/                        # 工具函数
│   └── ...                      # 各种通用工具
│
├── services/                     # 业务服务层
│   └── mode-handlers/           # 生成模式处理器
│
├── reducers/                     # Reducer 函数
│   └── ...                      # 状态管理 reducers
│
├── contexts/                     # React Context
│   └── ...                      # 全局 Context
│
├── styles/                       # 样式文件
│   └── ...                      # 全局样式与主题
│
├── public/                       # 静态资源
│   ├── images/                  # 图片资源
│   ├── icons/                   # 图标资源
│   ├── fonts/                   # 字体资源
│   └── lottie/                  # Lottie 动画
│
├── openspec/                     # OpenAPI 规范
│   └── changes/                 # API 变更记录
│
├── .husky/                       # Git Hooks
├── next.config.ts               # Next.js 配置
├── tailwind.config.ts           # Tailwind CSS 配置
├── tsconfig.json                # TypeScript 配置
├── eslint.config.mjs            # ESLint 配置
├── .prettierrc                  # Prettier 配置
├── package.json                 # 依赖声明
└── CLAUDE.md                    # 本文档
```

### 关键目录说明

**app/** - 采用 Next.js 15 App Router 架构:

- 页面路由与服务端 API Routes 统一管理
- `api/` 子目录包含所有服务端端点(代理、认证、上传等)

**components/** - 组件按功能模块划分:

- `generation/` 包含核心生成编排逻辑
- `editorPro/` 是基于 TipTap 的富文本编辑器
- `Renderer/` 负责多格式内容渲染

**hooks/** - 自定义 Hooks 封装业务逻辑:

- 生成相关: `useGenerationOrchestrator`, `useArticleStreaming`
- 市场相关: `usePredictionMarket`, `useMarketCreation`
- Web3 相关: `useTokenApprove`, `useBuyShares`

**lib/** - 核心基础设施:

- `api/client.ts` 是所有 HTTP 请求的入口
- `supabase/` 管理认证和数据库连接
- `contracts/` 处理 Web3 智能合约交互

**stores/** - 使用 Zustand 进行全局状态管理:

- 认证、订阅、内容、文章四大核心状态

**types/** - 完整的 TypeScript 类型系统:

- 与后端 API 契约保持一致

## 常用开发命令

### 开发与构建

```bash
pnpm dev          # 启动开发服务器(使用 Turbopack)
pnpm build        # 生产构建
pnpm start        # 启动生产服务器
```

### 代码质量

```bash
pnpm format       # 运行完整格式化流程: prettier + lint + tsc
pnpm lint         # ESLint 检查并自动修复
pnpm tsc          # TypeScript 类型检查(不生成输出文件)
pnpm prettier     # 格式化所有文件
```

## 核心架构

### 环境与 API 代理策略

**重要**: 本地开发环境使用 Next.js API Route 代理解决长耗时请求超时问题。

- **环境变量** (`constants/env.ts`):
  - `NEXT_PUBLIC_ENV`: `local` | `test` | `production`
  - 本地环境 (`local`): 请求走 `/api/proxy/[...slug]` 代理到后端
  - 测试/生产环境: 直接请求 `NEXT_PUBLIC_API_BASE_URL`

- **代理路由**:
  - `/app/api/proxy/[...slug]/route.ts`: 通用 REST API 代理(支持所有 HTTP 方法)
  - `/app/api/agent/chat/stream/route.ts`: SSE 流式聊天代理(nodejs runtime)
  - `/app/api/upload/image/route.ts`: 服务端图片上传到 Supabase Storage

### 生成编排架构 (Generation Orchestrator)

**核心文件**: `components/generation/GenerationOrchestrator.tsx`

生成流程采用两阶段编排:

1. **草稿确认阶段**: `ChatDraftConfirmation` - 与 AI 对话确认草案(仅 `draft` 模式)
2. **生成阶段**: `ArticleRenderer` - 执行内容生成和渲染

**生成模式** (`config/generation-modes.ts`):

- `draft`: 需要草稿确认,支持对话式调整
- `lite`: 快速生成模式,直接生成内容
- `analysis`: 深度分析模式,生成详细内容

每个模式有不同配置:

- `requiresDraftConfirmation`: 是否需要草稿确认
- `requiresSessionId`: 是否需要会话 ID
- `requiresUserInput`: 是否需要用户输入
- `timeout`: 请求超时时间

### API 客户端与认证流程

**核心文件**: `lib/api/client.ts`

- **认证**: 使用 Supabase Auth,Token 通过 Zustand store (`stores/authStore.ts`) 管理
- **401 自动重试**: 检测到 401 时自动调用 `supabase.auth.refreshSession()` 刷新 Token 并重试请求
- **积分检测**: 响应 `code=42000` 时自动触发积分不足弹窗(`useSubscriptionStore.setShowNoCreditsModal`)

**主要 API 方法**:

- `apiGet/apiPost`: 标准 REST 请求(自动处理 Token、超时、错误)
- `apiGetData/apiPostData`: 处理 `BaseResponse<T>` 包装格式
- `apiDirectRequest`: 绕过代理直接请求外部 API

### 数据流与状态管理

**状态管理**:

- **Zustand Stores**:
  - `authStore.ts`: 认证状态、用户信息、Token 管理
  - `subscriptionStore.ts`: 订阅状态、积分余额、套餐信息
  - `contentStore.ts`: 内容编辑状态
  - `articleStore.ts`: 文章相关状态

- **React Query**: 用于异步数据获取、缓存和同步

**重要 Hooks**:

- `useGenerateThread`: 同步/异步模式生成管理
- `useAsyncThreadGeneration`: 长任务轮询与持久化读取

### Supabase 集成

**核心文件**: `lib/supabase/client.ts`, `lib/supabase/server.ts`

- **客户端**: `createClient()` - 浏览器端使用,自动处理 Cookie
- **服务端**: `createAdminClient()` - 仅在 API Route 使用,需要 `SUPABASE_SERVICE_KEY`

**OAuth 回调** (`app/api/auth/callback/route.ts`):

1. 处理 Twitter/X OAuth 回调
2. 自动创建用户 profile
3. 调用后端 `/api/user/sign-up` 初始化用户数据

### 富文本与渲染

- **TipTap/ProseMirror**: 富文本编辑器核心(`components/editorPro/`)
- **Markdown**: 使用 `unified/remark` 解析和渲染(`lib/markdown/`)
- **Mindmap**: React Flow + dagre/elkjs 布局的思维导图可视化
- **ArticleRenderer**: 统一内容渲染入口,支持多种格式(Markdown/TipTap/Mindmap)

### SSE 流式通信

**核心文件**: `lib/api/agent-chat.ts`

- 使用 `@microsoft/fetch-event-source` 实现稳定的 SSE 连接
- 支持心跳、自动重连(限制最大次数)
- 完成态检测: 接收到 `chat.done` 事件后主动关闭连接
- 事件过滤: 忽略空事件和心跳事件

## 关键技术点

### 路径别名

```typescript
import { ... } from '@/...'  // @ 映射到项目根目录
```

### 服务端渲染

- 部分组件使用 `next/dynamic({ ssr: false })` 禁用 SSR(如编辑器组件)
- API Route 显式设置 `export const runtime = 'nodejs'` 和 `export const dynamic = 'force-dynamic'`

### 环境变量要求

**必需**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ENV`
- `NEXT_PUBLIC_API_BASE_URL`

**服务端专用(严禁暴露到客户端)**:

- `SUPABASE_SERVICE_KEY`: 仅在 API Route 中使用

### 代码质量保障

- Husky + lint-staged: 提交前自动格式化和 lint `*.ts, *.tsx`
- ESLint 9 + Prettier: 统一代码风格
- TypeScript strict 模式: 严格类型检查

## 调试建议

### 代理/超时问题

- 长耗时接口确保使用 `/api/proxy` 路由(本地环境)
- 检查 `constants/env.ts` 中的 `API_BASE_URL` 配置

### Token 过期

- 401 错误会自动刷新 Token,如果频繁失败检查 Supabase 配置
- 查看 `lib/api/client.ts` 中的 `apiRequest` 函数重试逻辑

### 图片上传

- 仅支持 `image/*` 类型,最大 10MB
- 服务端使用 `SUPABASE_SERVICE_KEY` 直传 Storage

### 积分不足

- 后端返回 `code=42000` 会自动触发弹窗
- 检查 `stores/subscriptionStore.ts` 中的 `showNoCreditsModal` 状态

## 测试与部署

### 本地测试

```bash
# 确保环境变量已配置
cp .env.example .env.local
pnpm dev
```

### 生产构建

```bash
pnpm build
pnpm start
```

### 部署注意事项

- 目标平台: Vercel 或任意 Node.js 平台
- SSE 路由需要 `nodejs` runtime
- 环境变量通过平台 Secret 注入(特别是 `SUPABASE_SERVICE_KEY`)
