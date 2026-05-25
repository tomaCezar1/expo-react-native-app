import CreateSubscriptionModal from '@/components/CreateSubscriptionModal';
import ListHeading from '@/components/list-heading';
import SubscriptionCard from '@/components/subscription-card';
import UpcomingSubscription from '@/components/upcoming-subscription';
import {
  HOME_BALANCE,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from '@/constants/data';
import { icons } from '@/constants/icons';
import images from '@/constants/images';
import { useSubscriptionsStore } from '@/store/subscriptionsStore';
import type { Subscription } from '@/types/data';
import { formatCurrency } from '@/utils/utils';
import dayjs from 'dayjs';
import { styled } from 'nativewind';
import { usePostHog } from 'posthog-react-native';
import { useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const addSubscription = useSubscriptionsStore((s) => s.addSubscription);
  const posthog = usePostHog();

  const formattedCurrency = formatCurrency(HOME_BALANCE.amount, 'mdl');
  const formattedRenewalDate = dayjs(HOME_BALANCE.nextRenewalDate).format(
    'MM/DD',
  );

  const handleSubscriptionCreated = (subscription: Subscription) => {
    addSubscription(subscription);
  };

  const handleSubscriptionPress = (id: string) => {
    const isExpanding = expandedSubscriptionId !== id;
    setExpandedSubscriptionId((currentId) => (currentId === id ? null : id));
    if (isExpanding) {
      posthog.capture('subscription_expanded', { subscription_id: id });
    } else {
      posthog.capture('subscription_collapsed', { subscription_id: id });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <CreateSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubscriptionCreated}
      />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>

              <Pressable onPress={() => setModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">{formattedCurrency}</Text>
                <Text className="home-balance-date">
                  {formattedRenewalDate}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />

              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => <UpcomingSubscription {...item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals.
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={subscriptions}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <Text className="home-empty-state">No Subscriptions yet.</Text>
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}
