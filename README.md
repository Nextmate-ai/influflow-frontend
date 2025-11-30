# Influflow Frontend - 双项目共享仓库

本仓库包含两个独立但共享基础设施的 Web 应用:

## 🎨 influxy - AI 内容创作平台
面向 KOL/创作者的智能写作与分发工具,提供从话题洞察、草案确认、流式生成、编辑优化到发布管理的一站式体验。

## 🎯 nextmate.fun - Web3 预测市场
基于区块链的预测市场平台,用户可以创建市场、购买份额、参与预测并获得收益。

---

## ✨ 核心功能

### influxy
- 🤖 **多模式 AI 生成**: Draft/Lite/Analysis 三种生成模式
- 🧭 **话题洞察**: 趋势推文搜索与热门话题推荐
- 🧠 **思维导图**: 可视化结构编辑,驱动重新生成
- ✍️ **智能编辑**: 段落级 AI 润色 (TipTap/ProseMirror)
- 🖼️ **配图管理**: 本地上传或 AI 生成
- 🔁 **流式对话**: 基于 SSE 的稳定会话
- 💳 **订阅系统**: 积分校验、套餐管理
- 🔗 **推荐系统**: 推荐码生成与奖励追踪

### nextmate.fun
- 🎲 **预测市场**: 完整的市场创建和管理流程
- 🔗 **智能合约**: Wagmi + Viem 集成
- 👛 **钱包认证**: Privy 去中心化认证
- 💰 **交易管理**: 份额交易、收益领取、创作者费用
- 👥 **权限管理**: 操作员角色与市场管理
- 📊 **参与历史**: 用户完整的交易记录

### 共享基础
- 👤 **用户体系**: Supabase Auth (Twitter OAuth)
- 📦 **API 代理**: Next.js API Route 统一代理
- 📱 **响应式 UI**: Tailwind CSS + HeroUI + Framer Motion

---

## 🧱 技术栈

### 核心框架
- **Next.js 15** - App Router + React 19 + Turbopack
- **TypeScript 5** - Strict 模式

### 状态与数据
- **Zustand 5** - 轻量级状态管理
- **TanStack Query 5** - 异步数据获取与缓存
- **Jotai 2** - 原子化状态管理

### Web3 (nextmate.fun)
- **Privy 3** - 钱包认证与管理
- **Wagmi 2** - React Hooks for Ethereum
- **Viem 2** - TypeScript Ethereum 库
- **RainbowKit 2** - 钱包连接 UI

### UI 与样式
- **Tailwind CSS 3** - 原子化 CSS
- **HeroUI 2** - React 组件库
- **Framer Motion 11** - 动画库
- **Lucide React** - 图标库

### 富文本 (influxy)
- **TipTap 2** - 富文本编辑器
- **ProseMirror** - 编辑器核心
- **Remark/Unified 11** - Markdown 处理

### 可视化
- **ReactFlow 11** - 思维导图
- **Recharts 2** - 图表库

### 后端集成
- **Supabase 2** - 认证、数据库、存储
- **Stripe 18** - 支付集成 (influxy)
- **@microsoft/fetch-event-source 2** - SSE 流式通信

---

## 🚀 快速开始

### 1. 环境准备
- Node.js ≥ 18 (推荐 20)
- PNPM 9

### 2. 安装依赖
```bash
pnpm install
```

### 3. 配置环境变量
在项目根目录创建 `.env.local`:

```bash
# 运行环境
NEXT_PUBLIC_ENV=local # local | test | production

# 后端 API
NEXT_PUBLIC_API_BASE_URL=https://influflow-api.up.railway.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key  # 仅服务端使用

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_EMAIL_AUTH_ENABLED=false
```

**重要提示:**
- `local` 环境: 请求走 `/api/proxy` 代理到后端
- `test/production` 环境: 直连 `NEXT_PUBLIC_API_BASE_URL`
- `SUPABASE_SERVICE_KEY` 仅在 API Route 使用,严禁暴露到客户端

### 4. 本地运行
```bash
pnpm dev
```

访问 http://localhost:3000

---

## 🧪 开发脚本

```bash
pnpm dev          # 启动开发服务器 (Turbopack)
pnpm build        # 生产构建
pnpm start        # 启动生产服务
pnpm format       # 格式化: prettier + lint + tsc
pnpm lint         # ESLint 检查
pnpm tsc          # TypeScript 类型检查
```

提交前会自动运行 Husky + lint-staged 格式化和校验。

---

## 🗂️ 目录结构

```
app/                      # Next.js App Router
  api/                    # API Routes
    agent/                # [influxy] SSE 流式 API
    twitter/              # [influxy] Twitter 集成
    upload/               # [influxy] 文件上传
    privy/                # [nextmate.fun] Privy 钱包集成
    proxy/                # [共享] REST API 代理
    auth/                 # [共享] 认证回调
  home/                   # [influxy] 首页
  subscription/           # [influxy] 订阅管理
  referral/               # [influxy] 推荐系统
  launchpad/              # [nextmate.fun] 预测市场
  profile/                # [共享] 用户资料

components/               # React 组件
  generation/             # [influxy] 生成编排
  Renderer/               # [influxy] 内容渲染
  editorPro/              # [influxy] 富文本编辑器
  draft/                  # [influxy] 草稿确认
  trending/               # [influxy] 话题趋势
  subscription/           # [influxy] 订阅组件
  referral/               # [influxy] 推荐组件
  launchpad/              # [nextmate.fun] 预测市场组件
  providers/              # [nextmate.fun] Privy Provider
  layout/                 # [共享] 布局组件
  auth/                   # [共享] 认证组件

hooks/                    # 自定义 Hooks (31个)
  [influxy] 生成相关      # 5个
  [influxy] 内容管理      # 3个
  [influxy] Twitter       # 5个
  [influxy] 聊天          # 1个
  [nextmate.fun] 预测市场 # 6个
  [nextmate.fun] Web3     # 7个
  [共享] 工具             # 4个

lib/                      # 核心工具库
  api/                    # API 客户端
  supabase/               # Supabase 集成
  contracts/              # [nextmate.fun] 智能合约
  markdown/               # [influxy] Markdown 解析
  stripe.ts               # [influxy] Stripe 支付

stores/                   # Zustand 状态管理
  authStore.ts            # [共享] 认证状态
  subscriptionStore.ts    # [influxy] 订阅状态
  contentStore.ts         # [influxy] 内容编辑
  articleStore.ts         # [influxy] 文章状态

types/                    # TypeScript 类型 (9个)
services/                 # 业务服务层
utils/                    # 工具函数 (11个)
config/                   # 配置文件
constants/                # 常量定义
```

---

## 🧭 架构设计

### API 代理策略
- **本地环境**: 请求走 `/api/proxy/[...slug]` 代理,解决长耗时请求超时
- **生产环境**: 直连后端 API
- **SSE 流式**: `/api/agent/chat/stream` 专用代理 (nodejs runtime)

### 生成编排 (influxy)
- `GenerationOrchestrator` 统一调度两阶段流程
- 草稿确认 → 内容生成
- 支持 Draft/Lite/Analysis 三种模式

### 状态管理
- **Zustand**: 全局状态 (认证、订阅、内容)
- **React Query**: 异步数据缓存
- **401 自动重试**: Token 刷新机制
- **积分检测**: `code=42000` 触发弹窗

### Web3 集成 (nextmate.fun)
- **Privy**: 钱包认证
- **Wagmi**: 智能合约交互
- **交易管理**: Gas、签名、确认自动处理

---

## 🛡️ 安全考虑

- ✅ `SUPABASE_SERVICE_KEY` 仅在服务端使用
- ✅ API 请求自动携带 Supabase Token
- ✅ 智能合约调用前检查余额和授权
- ✅ 用户输入使用 zod 验证
- ✅ OAuth 回调失败统一处理

---

## 🚢 部署指南

### Vercel (推荐)
1. 连接 GitHub 仓库
2. 配置环境变量 (平台 Secrets)
3. 自动构建部署

### 手动部署
```bash
pnpm build
pnpm start
```

**注意事项:**
- SSE 路由需要 `nodejs` runtime
- 环境变量通过平台 Secret 注入
- `SUPABASE_SERVICE_KEY` 严禁暴露到客户端

---

## 🧰 调试建议

| 问题 | 解决方案 |
|------|---------|
| 代理/超时 | 本地环境确保使用 `/api/proxy` |
| Token 过期 | 401 自动刷新,检查 Supabase 配置 |
| 图片上传 | 最大 10MB, 使用 `SUPABASE_SERVICE_KEY` |
| 积分不足 | `code=42000` 自动触发弹窗 |
| Web3 交易失败 | 检查钱包余额、授权状态 |

---

## 🤝 贡献指南

1. **分支规范**: `feature/*`, `fix/*`, `chore/*`
2. **提交规范**: 遵循 Conventional Commits
3. **代码质量**: 运行 `pnpm format` 和 `pnpm tsc`
4. **项目区分**: 标注是 [influxy] 还是 [nextmate.fun] 功能
5. **PR 要求**: 附上功能截图/录屏和测试说明

---

## 📚 相关文档

- **项目指南**: [CLAUDE.md](./CLAUDE.md) - 完整的项目结构和开发指南
- **nextmate.fun 文档**:
  - [LAUNCHPAD_GUIDE.md](./LAUNCHPAD_GUIDE.md) - 功能指南
  - [LAUNCHPAD_DESIGN_SYSTEM.md](./LAUNCHPAD_DESIGN_SYSTEM.md) - 设计系统
  - [LAUNCHPAD_QUICK_REFERENCE.md](./LAUNCHPAD_QUICK_REFERENCE.md) - 快速参考

---

## 📝 License

MIT License (如无特别声明)

---

**最后更新**: 2025-11-30

**维护建议**:
- 修改代码时注意区分 influxy 和 nextmate.fun 功能
- 共享部分修改需同时测试两个项目
- 建议使用不同 git 分支开发不同项目功能
