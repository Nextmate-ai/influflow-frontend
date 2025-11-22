# Launchpad Design System

本文档定义了 Launchpad 页面的视觉设计规范，确保所有组件保持一致的视觉风格。

## 颜色系统

### 主色调

#### 背景色
- **主背景**: `#0B041E` (深紫色)
- **卡片背景**: `#0B041E` (与主背景一致)
- **渐变背景**: `from-slate-900 via-slate-800 to-slate-900`

#### 边框色
- **主要边框**: `#2DC3D9` (青色)
- **次要边框**: `#60A5FA` (蓝色)
- **悬停边框**: `#2DC3D9` (与主要边框一致)

#### 文字色
- **主文字**: `white` (#FFFFFF)
- **次要文字**: `gray-400` (#9CA3AF)
- **提示文字**: `#00D9F5` (亮青色)

#### 渐变文字
- **标签渐变**: `from-[#ACB6E5] to-[#86FDE8]`
  - 起始色: `#ACB6E5` (淡紫色)
  - 结束色: `#86FDE8` (青色)

### 功能色

#### 按钮渐变
- **创建按钮**: `from-[#1FA2FF] via-[#12D8FA] to-[#6155F5]`
  - 起始: `#1FA2FF` (蓝色)
  - 中间: `#12D8FA` (青色)
  - 结束: `#6155F5` (紫色)

#### 选项按钮
- **Yes 选项**:
  - 选中: `border-2 border-[#2DC3D9] bg-[#2DC3D9]`
  - 未选中: `border border-[#2DC3D9] bg-transparent hover:bg-[#2DC3D9]/10`
- **No 选项**:
  - 选中: `border-2 border-[#D602FF] bg-[#D602FF]`
  - 未选中: `border border-[#D602FF] bg-transparent hover:bg-[#D602FF]/10`

#### 状态色
- **Active**: `text-green-400` (#4ADE80)
- **Resolved**: `text-blue-400` (#60A5FA)
- **Void**: `text-gray-400` (#9CA3AF)

#### 投票比例渐变
- **Yes 侧**: `from-[#00B2FF] to-[#00FFD0]`
  - 起始: `#00B2FF` (蓝色)
  - 结束: `#00FFD0` (青色)
- **No 侧**: `from-[#870CD8] to-[#FF2DDF]`
  - 起始: `#870CD8` (紫色)
  - 结束: `#FF2DDF` (粉色)

## 间距系统

### 圆角
- **小圆角**: `rounded-lg` (8px)
- **中圆角**: `rounded-2xl` (16px)
- **大圆角**: `rounded-[10px]` (10px)
- **完全圆角**: `rounded-full` (9999px)

### 内边距
- **卡片内边距**: `p-6` (24px)
- **模态框内边距**: `p-8` (32px)
- **按钮内边距**: `px-[24px]` (24px 水平)

### 外边距
- **组件间距**: `mb-[20px]` (20px)
- **元素间距**: `gap-3` (12px), `gap-4` (16px)

## 字体系统

### 字号
- **标题**: `text-2xl` (24px), `text-4xl` (36px)
- **正文**: `text-base` (16px)
- **小字**: `text-sm` (14px), `text-xs` (12px)
- **大数字**: `text-3xl` (30px)

### 字重
- **常规**: `font-medium` (500)
- **加粗**: `font-semibold` (600)
- **特粗**: `font-bold` (700)

## 组件规范

### 按钮

#### 主要按钮（创建按钮）
```tsx
<div className="h-[56px] rounded-[10px] bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#6155F5] p-[2px] transition-all hover:shadow-lg hover:shadow-cyan-500/50">
  <div className="flex size-full items-center justify-center rounded-[8px] bg-[#0B041E] px-[24px] font-semibold text-white">
    Create
  </div>
</div>
```

#### 选项按钮（Yes/No）
```tsx
// Yes 选中状态
className="flex h-[52px] w-[100px] items-center justify-center rounded-2xl text-base font-medium text-white transition-all duration-200 border-2 border-[#2DC3D9] bg-[#2DC3D9]"

// No 选中状态
className="flex h-[52px] w-[100px] items-center justify-center rounded-2xl text-base font-medium text-white transition-all duration-200 border-2 border-[#D602FF] bg-[#D602FF]"
```

### 输入框

#### 标准输入框
```tsx
<Input
  classNames={{
    input: 'bg-transparent text-white text-base placeholder-gray-500',
    inputWrapper: 'bg-transparent border border-[#2DC3D9] rounded-2xl hover:border-[#2DC3D9] focus-within:border-[#2DC3D9]',
  }}
/>
```

### 标签

#### 渐变标签
```tsx
<label className="mb-1 block bg-gradient-to-r from-[#ACB6E5] to-[#86FDE8] bg-clip-text text-base font-medium text-transparent">
  Label Text
</label>
```

### 卡片

#### 预测卡片
```tsx
<div className="group relative flex cursor-pointer flex-col rounded-2xl border border-[#60A5FA] p-6 pb-[20px] pt-[32px] transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20">
  {/* 卡片内容 */}
</div>
```

### 模态框

#### 标准模态框
```tsx
<ModalContent className="rounded-2xl border border-[#2DC3D9] bg-[#0B041E] p-0">
  {/* 模态框内容 */}
</ModalContent>
```

### 状态标签

#### 状态显示
```tsx
// Active
<span className="text-xs font-medium text-green-400">Active</span>

// Resolved
<span className="text-xs font-medium text-blue-400">Resolved</span>

// Void
<span className="text-xs font-medium text-gray-400">Void</span>
```

## 阴影系统

### 卡片阴影
- **悬停阴影**: `hover:shadow-xl hover:shadow-cyan-500/20`
- **按钮阴影**: `hover:shadow-lg hover:shadow-cyan-500/50`

### 头像阴影
- **头像阴影**: `shadow-lg shadow-[#60A5FA]/30`

## 交互效果

### 过渡动画
- **标准过渡**: `transition-all duration-200`
- **悬停透明度**: `hover:opacity-80`
- **悬停背景**: `hover:bg-[#2DC3D9]/10`

### 禁用状态
- **禁用样式**: `disabled:cursor-not-allowed disabled:opacity-50`
- **禁用透明度**: `disabled:opacity-30`

## 布局规范

### 容器
- **最大宽度**: `max-w-7xl` (1280px)
- **内边距**: `px-[64px]` (64px 水平)

### 网格
- **卡片网格**: 使用 `grid` 布局，响应式列数

## 图标规范

### 图标尺寸
- **小图标**: `12px` (width={12} height={12})
- **中图标**: `24px` (width={24} height={24})
- **大图标**: 根据上下文调整

## 使用示例

### 创建新组件时
1. 使用定义的颜色变量
2. 遵循间距系统
3. 应用标准的圆角和阴影
4. 保持一致的交互效果
5. 使用渐变文字作为标签

### 修改现有组件时
1. 检查是否符合设计规范
2. 保持视觉一致性
3. 更新相关文档

## 注意事项

1. **颜色一致性**: 所有组件应使用规范中定义的颜色，避免自定义颜色
2. **间距统一**: 使用定义的间距值，保持视觉节奏
3. **交互反馈**: 所有可交互元素应有明确的悬停和点击反馈
4. **响应式设计**: 确保在不同屏幕尺寸下保持良好的视觉效果
5. **可访问性**: 确保颜色对比度符合 WCAG 标准

