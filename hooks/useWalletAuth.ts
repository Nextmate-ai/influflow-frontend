/**
 * 获取钱包认证信息 Hook
 * 用于获取 Privy 的 X (Twitter) 登录用户信息
 */

import { usePrivy } from '@privy-io/react-auth';
import { useMemo } from 'react';

import { getHighResTwitterAvatar } from '@/utils/avatar';

interface WalletAuthInfo {
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
}

/**
 * 获取钱包认证信息
 * 从 Privy 获取 X (Twitter) 登录的用户信息
 */
export function useWalletAuth() {
  const { ready, authenticated, user } = usePrivy();

  const authInfo: WalletAuthInfo | null = useMemo(() => {
    if (!authenticated || !user) {
      return null;
    }

    const info: WalletAuthInfo = {};

    // 从 Privy user 对象获取 X (Twitter) 账号信息
    if (user.twitter) {
      info.name = user.twitter.name || undefined;
      info.username = user.twitter.username || undefined;
      info.avatar = getHighResTwitterAvatar(
        user.twitter.profilePictureUrl || undefined,
      );
    }

    // 如果有邮箱账号,也添加进来
    if (user.email && !info.email) {
      info.email = user.email.address;
    }

    return Object.keys(info).length > 0 ? info : null;
  }, [authenticated, user]);

  return {
    authInfo,
    isLoading: !ready,
    hasAuthInfo: !!authInfo && (!!authInfo.name || !!authInfo.username),
  };
}
