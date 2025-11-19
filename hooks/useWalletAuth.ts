/**
 * 获取钱包认证信息 Hook
 * 用于获取 thirdweb inAppWallet 的 X 登录用户信息
 */

import { useEffect, useState } from 'react';
import { useActiveWallet } from 'thirdweb/react';

interface WalletAuthInfo {
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
}

/**
 * 获取钱包认证信息
 * 尝试从 thirdweb inAppWallet 获取 X 登录的用户信息
 */
export function useWalletAuth() {
  const wallet = useActiveWallet();
  const [authInfo, setAuthInfo] = useState<WalletAuthInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthInfo = async () => {
      if (!wallet) {
        setAuthInfo(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // 尝试获取认证详情
        // thirdweb inAppWallet 可能提供 getAuthDetails 方法
        if ('getAuthDetails' in wallet && typeof wallet.getAuthDetails === 'function') {
          const authDetails = await wallet.getAuthDetails();
          console.log('Auth details:', authDetails);

          // 尝试从 authDetails 中提取用户信息
          if (authDetails) {
            const info: WalletAuthInfo = {};

            // 检查不同的可能字段名
            if (authDetails.name) info.name = authDetails.name;
            if (authDetails.username) info.username = authDetails.username;
            if (authDetails.avatar || authDetails.profile_image_url) {
              info.avatar = authDetails.avatar || authDetails.profile_image_url;
            }
            if (authDetails.email) info.email = authDetails.email;

            // 如果 authDetails 有 user 对象
            if (authDetails.user) {
              const user = authDetails.user;
              if (user.name) info.name = user.name;
              if (user.username) info.username = user.username;
              if (user.avatar || user.profile_image_url) {
                info.avatar = user.avatar || user.profile_image_url;
              }
              if (user.email) info.email = user.email;
            }

            // 如果 authDetails 有 metadata 对象
            if (authDetails.metadata) {
              const metadata = authDetails.metadata;
              if (metadata.name) info.name = metadata.name;
              if (metadata.username) info.username = metadata.username;
              if (metadata.avatar || metadata.profile_image_url) {
                info.avatar = metadata.avatar || metadata.profile_image_url;
              }
              if (metadata.email) info.email = metadata.email;
            }

            if (Object.keys(info).length > 0) {
              setAuthInfo(info);
            } else {
              setAuthInfo(null);
            }
          } else {
            setAuthInfo(null);
          }
        } else {
          // 如果没有 getAuthDetails 方法，尝试其他方法
          // 检查 wallet 对象本身是否有用户信息
          const walletAny = wallet as any;
          if (walletAny.user) {
            const user = walletAny.user;
            setAuthInfo({
              name: user.name,
              username: user.username,
              avatar: user.avatar || user.profile_image_url,
              email: user.email,
            });
          } else {
            setAuthInfo(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch wallet auth info:', error);
        setAuthInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthInfo();
  }, [wallet]);

  return {
    authInfo,
    isLoading,
    hasAuthInfo: !!authInfo && (!!authInfo.name || !!authInfo.username),
  };
}

