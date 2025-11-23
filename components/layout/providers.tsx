'use client';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { AuthProvider } from '@/components/auth/AuthProvider';
import NoCreditsModal from '@/components/modals/NoCreditsModal';
import PrivyProvider from '@/components/providers/PrivyProvider';
import { SubscriptionSync } from '@/components/subscription/SubscriptionSync';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { showNoCreditsModal, setShowNoCreditsModal } = useSubscriptionStore();

  return (
    <HeroUIProvider navigate={router.push}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider>
          <AuthProvider>{children}</AuthProvider>
          <SubscriptionSync />
          <NoCreditsModal
            isOpen={showNoCreditsModal}
            onClose={() => setShowNoCreditsModal(false)}
          />
        </PrivyProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
