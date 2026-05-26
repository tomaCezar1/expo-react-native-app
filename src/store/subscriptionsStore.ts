import { HOME_SUBSCRIPTIONS } from '@/constants/data';
import type { Subscription } from '@/types/data';
import { create } from 'zustand';

interface SubscriptionsStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
}

export const useSubscriptionsStore = create<SubscriptionsStore>((set) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (subscription) =>
    set((state) => ({
      subscriptions: [subscription, ...state.subscriptions],
    })),
}));
