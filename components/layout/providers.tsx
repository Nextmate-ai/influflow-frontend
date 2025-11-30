'use client';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { AuthProvider } from '@/components/auth/AuthProvider';
import NoCreditsModal from '@/components/modals/NoCreditsModal';
import PrivyProvider from '@/components/providers/PrivyProvider';
import { SubscriptionSync } from '@/components/subscription/SubscriptionSync';
import { OperatorRoleSync } from '@/components/launchpad/OperatorRoleSync';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000, // 默认3分钟内数据保持新鲜
      gcTime: 10 * 60 * 1000, // 10分钟后清除未使用的缓存
      retry: 1, // 失败重试1次
      refetchOnWindowFocus: false, // 窗口聚焦时不自动重新获取
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { showNoCreditsModal, setShowNoCreditsModal } = useSubscriptionStore();

  return (
    <HeroUIProvider navigate={router.push}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider>
          <AuthProvider>{children}</AuthProvider>
          <SubscriptionSync />
          <OperatorRoleSync />
          <NoCreditsModal
            isOpen={showNoCreditsModal}
            onClose={() => setShowNoCreditsModal(false)}
          />
          <ToastProvider placement="bottom-center" toastOffset={16} />
        </PrivyProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
