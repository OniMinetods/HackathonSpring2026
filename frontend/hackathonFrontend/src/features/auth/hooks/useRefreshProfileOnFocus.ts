import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useAuth } from './useAuth';

/** При каждом показе экрана (вкладки) — GET /api/users/profile/. */
export function useRefreshProfileOnFocus() {
  const { token, refreshProfile } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!token?.trim()) {
        return;
      }
      void refreshProfile();
    }, [token, refreshProfile]),
  );
}
