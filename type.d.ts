import type { ImageSourcePropType } from 'react-native';

declare global {
  interface TabIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
  }

  interface SubscriptionCardProps extends Omit<Subscription, 'id'> {
    expanded: boolean;
    onPress: () => void;
    onCancelPress?: () => void;
    isCancelling?: boolean;
  }

  interface UpcomingSubscriptionCardProps extends Omit<
    UpcomingSubscription,
    'id'
  > {}

  interface ListHeadingProps {
    title: string;
  }
}

export {};
