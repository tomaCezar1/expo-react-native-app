import type { ImageSourcePropType } from 'react-native';

export interface AppTab {
  name: string;
  title: string;
  icon: ImageSourcePropType;
}

export interface UpcomingSubscription {
  id: string;
  icon: ImageSourcePropType;
  name: string;
  price: number;
  currency?: string;
  daysLeft: number;
}

export interface Subscription {
  id: string;
  icon: ImageSourcePropType;
  name: string;
  plan?: string;
  category?: string;
  paymentMethod?: string;
  status?: string;
  startDate?: string;
  price: number;
  currency?: string;
  billing: string;
  renewalDate?: string;
  color?: string;
}
