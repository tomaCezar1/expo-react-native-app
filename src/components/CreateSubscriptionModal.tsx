import { icons } from '@/constants/icons';
import type { Subscription } from '@/types/data';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

type Frequency = 'Monthly' | 'Yearly';

const CATEGORIES = [
  'Entertainment',
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other',
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: '#f5c542',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  Design: '#ffd6c0',
  Productivity: '#c0f0d8',
  Cloud: '#c0d8f0',
  Music: '#f0c0e8',
  Other: '#e0e0e0',
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [category, setCategory] = useState('');

  const nameValid = name.trim().length > 0;
  const priceNum = parseFloat(price);
  const priceValid = !isNaN(priceNum) && priceNum > 0;
  const formValid = nameValid && priceValid;

  const handleSubmit = () => {
    if (!formValid) return;

    const startDate = dayjs().toISOString();
    const renewalDate =
      frequency === 'Monthly'
        ? dayjs().add(1, 'month').toISOString()
        : dayjs().add(1, 'year').toISOString();

    const newSubscription: Subscription = {
      id: `${name.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      icon: icons.wallet,
      name: name.trim(),
      price: priceNum,
      currency: 'USD',
      billing: frequency,
      frequency,
      status: 'active',
      startDate,
      renewalDate,
      category: category || 'Other',
      color: CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Other'],
    } as Subscription & { frequency: Frequency };

    onSubmit(newSubscription);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setCategory('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="modal-overlay">
          <Pressable className="flex-1" onPress={handleClose} />

          <View className="modal-container">
            {/* Header */}
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            {/* Body */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="modal-body">
                {/* Name field */}
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="e.g. Netflix"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    value={name}
                    onChangeText={setName}
                    returnKeyType="next"
                  />
                </View>

                {/* Price field */}
                <View className="auth-field">
                  <Text className="auth-label">Price (USD)</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="0.00"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </View>

                {/* Frequency toggle */}
                <View className="auth-field">
                  <Text className="auth-label">Billing Frequency</Text>
                  <View className="picker-row">
                    {(['Monthly', 'Yearly'] as Frequency[]).map((option) => (
                      <Pressable
                        key={option}
                        className={clsx(
                          'picker-option',
                          frequency === option && 'picker-option-active',
                        )}
                        onPress={() => setFrequency(option)}
                      >
                        <Text
                          className={clsx(
                            'picker-option-text',
                            frequency === option && 'picker-option-text-active',
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Category chips */}
                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat}
                        className={clsx(
                          'category-chip',
                          category === cat && 'category-chip-active',
                        )}
                        onPress={() =>
                          setCategory((prev) => (prev === cat ? '' : cat))
                        }
                      >
                        <Text
                          className={clsx(
                            'category-chip-text',
                            category === cat && 'category-chip-text-active',
                          )}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Submit button */}
                <Pressable
                  className={clsx(
                    'auth-button',
                    !formValid && 'auth-button-disabled',
                  )}
                  onPress={handleSubmit}
                  disabled={!formValid}
                >
                  <Text className="auth-button-text">Add Subscription</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
