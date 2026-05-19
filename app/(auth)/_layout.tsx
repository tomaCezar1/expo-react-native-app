import '@/global.css';
import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

/**
 * Auth route group layout with protection
 * Redirects authenticated users to the home/tabs screen
 */
export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // Show nothing while checking auth state
    return null;
  }

  // If user is already signed in, redirect to home
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
