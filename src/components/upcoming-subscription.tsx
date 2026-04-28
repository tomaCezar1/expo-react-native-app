import { formatCurrency } from '@/utils/utils';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

interface UpcomingSubscriptionProps {
  icon: ImageSourcePropType;
  name: string;
  price: number;
  currency?: string;
  daysLeft: number;
}

const UpcomingSubscription = ({
  name,
  price,
  daysLeft,
  icon,
  currency,
}: UpcomingSubscriptionProps) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />

        <View>
          <Text className="upcoming-price">
            {formatCurrency(price, currency)}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left` : 'Last day left'}
          </Text>
        </View>
      </View>

      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default UpcomingSubscription;
