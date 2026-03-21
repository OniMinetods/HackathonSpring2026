import { Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useAuth } from '../features/auth/hooks/useAuth'
import { Providers } from './providers'

function RootNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? (
        <View>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="calculator" />
          <Stack.Screen name="rating-my-place" />
        </View>
      ) : (
        <Stack.Screen name="login" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Providers>
        <View style={styles.background}>
          <RootNavigator />
        </View>
      </Providers>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#111111',
  },
});
