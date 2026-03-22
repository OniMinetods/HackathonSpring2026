import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { useAuth } from './useAuth'

export function useRefreshProfileOnFocus() {
  const { refreshProfile } = useAuth();

  useFocusEffect(
    useCallback(() => {
      void refreshProfile();
    }, [refreshProfile]),
  );
}
