import SubscriptionCard from '@/components/subscription-card';
import { icons } from '@/constants/icons';
import { useSubscriptionsStore } from '@/store/subscriptionsStore';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
import { FlatList, Image, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscriptions;
    return subscriptions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.plan?.toLowerCase().includes(q),
    );
  }, [query, subscriptions]);

  const handlePress = (id: string) =>
    setExpandedId((current) => (current === id ? null : id));

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="list-title mb-5">Subscriptions</Text>

      <View className="subs-search-wrap">
        <Image source={icons.menu} className="subs-search-icon" />
        <TextInput
          className="subs-search-input"
          placeholder="Search subscriptions..."
          placeholderTextColor="rgba(0,0,0,0.35)"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() => handlePress(item.id)}
          />
        )}
        extraData={expandedId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
        ListEmptyComponent={
          <Text className="subs-empty">No subscriptions found.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
