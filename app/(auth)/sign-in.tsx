import { useSignIn } from '@clerk/expo';
import { Link, useRouter, type Href } from 'expo-router';
import { styled } from 'nativewind';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Client-side validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const isValidPassword = password.length >= 8;
  const isValidCode = code.length === 6 || code.length === 0;

  const emailError =
    emailTouched && emailAddress && !isValidEmail
      ? 'Invalid email format'
      : undefined;
  const passwordError =
    passwordTouched && password && !isValidPassword
      ? 'Minimum 8 characters required'
      : undefined;

  // Check if we're in the verification code step
  const isEmailStep = !signIn?.firstFactorVerification;
  const isCodeStep =
    (signIn?.firstFactorVerification as any)?.status === 'needs_input' ||
    (signIn?.firstFactorVerification as any)?.status === 'unverified';
  const formValid = isCodeStep
    ? isValidCode && code
    : isValidEmail && isValidPassword;

  // Step 1: Enter email and password
  const handleEmailPasswordSubmit = async () => {
    if (!isValidEmail || !isValidPassword) return;

    try {
      await signIn?.create({
        identifier: emailAddress.trim().toLowerCase(),
        password: password.trim(),
      });

      // After successful creation, prepare for code verification
      try {
        await (signIn as any)?.prepareFirstFactor({
          strategy: 'email_code',
        });
      } catch {
        // Continue with existing flow
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
    }
  };

  // Step 2: Verify with code
  const handleCodeSubmit = async () => {
    if (!isValidCode || !code.trim()) return;

    try {
      await (signIn as any)?.attemptFirstFactor({
        strategy: 'email_code',
        code: code.trim(),
      });

      // Code verification successful, user is signed in
      router.replace('/(tabs)' as Href);
    } catch (error: any) {
      console.error('Code verification error:', error);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    try {
      await (signIn as any)?.prepareFirstFactor({
        strategy: 'email_code',
      });
    } catch (error: any) {
      console.error('Resend code error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-5 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center">
            {isEmailStep ? (
              // Email & Password Step
              <>
                <View className="mb-8">
                  <Text className="text-4xl font-sans-extrabold text-primary mb-2">
                    Welcome Back
                  </Text>
                  <Text className="text-base font-sans-regular text-primary/60">
                    Sign in to your account
                  </Text>
                </View>

                {/* Display Clerk API errors */}
                {(errors as any)?.email && (
                  <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <Text className="text-sm font-sans-medium text-red-700">
                      {(errors as any).email[0]?.message || 'An error occurred'}
                    </Text>
                  </View>
                )}

                <View className="gap-4 mb-6">
                  <View>
                    <Text className="text-sm font-sans-semibold text-primary mb-2">
                      Email Address
                    </Text>
                    <TextInput
                      className={`bg-white border ${emailError ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-primary`}
                      placeholder="you@example.com"
                      placeholderTextColor="#999"
                      value={emailAddress}
                      onChangeText={setEmailAddress}
                      onBlur={() => setEmailTouched(true)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      editable={fetchStatus !== 'fetching'}
                    />
                    {emailError && (
                      <Text className="text-xs font-sans-medium text-red-500 mt-1">
                        {emailError}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-sm font-sans-semibold text-primary mb-2">
                      Password
                    </Text>
                    <TextInput
                      className={`bg-white border ${passwordError ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 text-primary`}
                      placeholder="••••••••"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      onBlur={() => setPasswordTouched(true)}
                      secureTextEntry
                      autoComplete="password"
                      editable={fetchStatus !== 'fetching'}
                    />
                    {passwordError && (
                      <Text className="text-xs font-sans-medium text-red-500 mt-1">
                        {passwordError}
                      </Text>
                    )}
                    {!passwordTouched && (
                      <Text className="text-xs font-sans-medium text-primary/60 mt-1">
                        Minimum 8 characters required
                      </Text>
                    )}
                  </View>
                </View>

                <Pressable
                  className={`auth-button ${(!formValid || fetchStatus === 'fetching') && 'auth-button-disabled'}`}
                  onPress={handleEmailPasswordSubmit}
                  disabled={!formValid || fetchStatus === 'fetching'}
                >
                  <Text className="auth-button-text">
                    {fetchStatus === 'fetching' ? 'Signing In...' : 'Continue'}
                  </Text>
                </Pressable>

                <View className="auth-link-row">
                  <Text className="auth-link-copy">
                    Don&apos;t have an account?
                  </Text>
                  <Link href="/(auth)/sign-up" asChild>
                    <Pressable>
                      <Text className="auth-link">Sign Up</Text>
                    </Pressable>
                  </Link>
                </View>
              </>
            ) : isCodeStep ? (
              // Code Verification Step
              <>
                <View className="mb-8">
                  <Text className="text-3xl font-sans-extrabold text-primary mb-2">
                    Verify Email
                  </Text>
                  <Text className="text-base font-sans-regular text-primary/60">
                    We&apos;ve sent a code to {emailAddress}
                  </Text>
                </View>

                {(errors as any)?.code && (
                  <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <Text className="text-sm font-sans-medium text-red-700">
                      {(errors as any).code[0]?.message || 'Invalid code'}
                    </Text>
                  </View>
                )}

                <View className="mb-6">
                  <Text className="text-sm font-sans-semibold text-primary mb-2">
                    Verification Code
                  </Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-primary text-center text-lg tracking-widest"
                    placeholder="000000"
                    placeholderTextColor="#999"
                    value={code}
                    onChangeText={setCode}
                    maxLength={6}
                    keyboardType="numeric"
                    editable={fetchStatus !== 'fetching'}
                  />
                </View>

                <Pressable
                  className={`auth-button ${(!formValid || fetchStatus === 'fetching') && 'auth-button-disabled'}`}
                  onPress={handleCodeSubmit}
                  disabled={!formValid || fetchStatus === 'fetching'}
                >
                  <Text className="auth-button-text">
                    {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleResendCode}
                  disabled={fetchStatus === 'fetching'}
                  className={fetchStatus === 'fetching' ? 'opacity-50' : ''}
                >
                  <Text className="auth-link font-sans-semibold text-center text-sm text-accent">
                    Didn&apos;t receive a code? Resend
                  </Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
