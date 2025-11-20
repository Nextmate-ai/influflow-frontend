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

        const walletAny = wallet as any;
        const info: WalletAuthInfo = {};

        // 方法1: 尝试 getAuthDetails 方法
        if (
          'getAuthDetails' in wallet &&
          typeof wallet.getAuthDetails === 'function'
        ) {
          try {
            const authDetails = await wallet.getAuthDetails();
            console.log('Auth details from getAuthDetails:', authDetails);

            if (authDetails) {
              // 检查不同的可能字段名
              if (authDetails.name) info.name = authDetails.name;
              if (authDetails.username) info.username = authDetails.username;
              if (authDetails.avatar || authDetails.profile_image_url) {
                info.avatar =
                  authDetails.avatar || authDetails.profile_image_url;
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
            }
          } catch (err) {
            console.log('getAuthDetails failed:', err);
          }
        }

        // 方法2: 检查 wallet 对象本身的属性
        if (!info.name && !info.username) {
          console.log('Wallet object keys:', Object.keys(walletAny));

          if (walletAny.user) {
            const user = walletAny.user;
            if (user.name) info.name = user.name;
            if (user.username) info.username = user.username;
            if (user.avatar || user.profile_image_url) {
              info.avatar = user.avatar || user.profile_image_url;
            }
            if (user.email) info.email = user.email;
          }

          // 检查其他可能的属性
          if (walletAny.authDetails) {
            const authDetails = walletAny.authDetails;
            if (authDetails.name) info.name = authDetails.name;
            if (authDetails.username) info.username = authDetails.username;
            if (authDetails.avatar || authDetails.profile_image_url) {
              info.avatar = authDetails.avatar || authDetails.profile_image_url;
            }
          }

          if (walletAny.profile) {
            const profile = walletAny.profile;
            if (profile.name) info.name = profile.name;
            if (profile.username) info.username = profile.username;
            if (profile.avatar || profile.profile_image_url) {
              info.avatar = profile.avatar || profile.profile_image_url;
            }
          }
        }

        // 方法3: 检查 localStorage 中是否有存储的认证信息
        if (!info.name && !info.username && typeof window !== 'undefined') {
          try {
            // thirdweb 可能在 localStorage 中存储认证信息
            const storageKeys = Object.keys(localStorage);
            const thirdwebKeys = storageKeys.filter(
              (key) =>
                key.includes('thirdweb') ||
                key.includes('inApp') ||
                key.includes('auth'),
            );

            for (const key of thirdwebKeys) {
              try {
                const stored = localStorage.getItem(key);
                if (stored) {
                  const parsed = JSON.parse(stored);
                  console.log(`Checking localStorage key ${key}:`, parsed);

                  // 尝试从存储的数据中提取用户信息
                  if (parsed.user) {
                    const user = parsed.user;
                    if (user.name && !info.name) info.name = user.name;
                    if (user.username && !info.username)
                      info.username = user.username;
                    if (
                      (user.avatar || user.profile_image_url) &&
                      !info.avatar
                    ) {
                      info.avatar = user.avatar || user.profile_image_url;
                    }
                  }

                  if (parsed.name && !info.name) info.name = parsed.name;
                  if (parsed.username && !info.username)
                    info.username = parsed.username;
                  if (
                    (parsed.avatar || parsed.profile_image_url) &&
                    !info.avatar
                  ) {
                    info.avatar = parsed.avatar || parsed.profile_image_url;
                  }
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          } catch (e) {
            console.log('localStorage check failed:', e);
          }
        }

        if (Object.keys(info).length > 0) {
          console.log('Found auth info:', info);
          setAuthInfo(info);
        } else {
          console.log('No auth info found');
          setAuthInfo(null);
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
