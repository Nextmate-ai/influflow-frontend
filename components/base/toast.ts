import { addToast as heroAddToast } from '@heroui/toast';

type HeroToastOptions = Parameters<typeof heroAddToast>[0];

export const addToast = (
  options: Omit<HeroToastOptions, 'timeout'> & { timeout?: number },
) => {
  return heroAddToast({
    ...options,
    timeout: options.timeout ?? 3000,
  });
};
