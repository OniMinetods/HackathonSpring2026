import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Providers } from './providers';

function RootNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="login" />}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Providers>
        <RootNavigator />
      </Providers>
    </SafeAreaProvider>
  );
}
