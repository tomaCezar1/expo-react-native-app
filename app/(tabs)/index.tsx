import ListHeading from '@/components/list-heading';
import UpcomingSubscription from '@/components/upcoming-subscription';
import {
  HOME_BALANCE,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from '@/constants/data';
import { icons } from '@/constants/icons';
import images from '@/constants/images';
import { formatCurrency } from '@/utils/utils';
import dayjs from 'dayjs';
import { styled } from 'nativewind';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const formattedCurrency = formatCurrency(HOME_BALANCE.amount, 'mdl');
  const formattedRenewalDate = dayjs(HOME_BALANCE.nextRenewalDate).format(
    'MM/DD',
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />
          <Text className="home-user-name">{HOME_USER.name}</Text>
        </View>

        <Image source={icons.add} className="home-add-icon" />
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>

        <View className="home-balance-row">
          <Text className="home-balance-amount">{formattedCurrency}</Text>
          <Text className="home-balance-date">{formattedRenewalDate}</Text>
        </View>
      </View>

      <View>
        <ListHeading title="Upcoming" />

        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          renderItem={({ item }) => <UpcomingSubscription {...item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">No upcoming renewals.</Text>
          }
        />
      </View>

      <View>
        <ListHeading title="All Subscriptions" />
      </View>
    </SafeAreaView>
  );
}
