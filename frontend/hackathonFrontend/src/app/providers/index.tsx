import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from 'src/features/auth/hooks/useAuth';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </AuthProvider>
  );
}
