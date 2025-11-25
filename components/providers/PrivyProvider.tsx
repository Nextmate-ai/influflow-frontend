'use client';

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { baseSepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';

import { PRIVY_APP_ID } from '@/constants/env';

// Wagmi 配置
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export default function PrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BasePrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        // 登录方式 - 只支持 X (Twitter)
        loginMethods: ['twitter'],

        // 外观配置
        appearance: {
          theme: '#13152F', // 使用稍亮的深紫色，Privy 会自动生成匹配的前景色和背景色，与页面背景更融合
          accentColor: '#2DC3D9', // 使用与页面一致的青色
        },

        // 嵌入式钱包配置
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets' as any,
          },
        },

        // 支持的链
        supportedChains: [baseSepolia],

        // 默认链
        defaultChain: baseSepolia,
      }}
    >
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </BasePrivyProvider>
  );
}
