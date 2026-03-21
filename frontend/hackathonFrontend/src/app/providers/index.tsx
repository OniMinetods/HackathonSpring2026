import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SafeAreaProvider>
      {/* Add other providers here */}
      {children}
    </SafeAreaProvider>
  );
}
