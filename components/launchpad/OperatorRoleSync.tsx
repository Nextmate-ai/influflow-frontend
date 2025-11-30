'use client';

/**
 * Operator Role 同步组件
 * 在用户钱包连接后自动检查 operator 权限
 */

import { useOperatorRole } from '@/hooks/useOperatorRole';

export function OperatorRoleSync() {
  // 调用 hook 自动检查权限
  useOperatorRole();

  // 这个组件不渲染任何内容
  return null;
}
