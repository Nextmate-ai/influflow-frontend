'use client';

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const queryClient = new QueryClient();

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
          theme: 'light',
          accentColor: '#676FFF',
          showWalletLoginFirst: false,
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
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </BasePrivyProvider>
  );
}
