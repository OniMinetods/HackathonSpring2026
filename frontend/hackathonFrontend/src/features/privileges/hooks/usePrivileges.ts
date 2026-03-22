import { useCallback, useEffect, useMemo, useState } from 'react';
import type { UserStatus } from 'src/features/auth/api/authTypes';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { fetchPrivileges } from 'src/features/privileges/api/privilegesApi';
import { splitPrivilegesByUser } from 'src/features/privileges/lib/splitPrivilegesByUser';
import type { PrivilegeDto } from 'src/features/privileges/model/privilegeTypes';

export function usePrivileges(userTier: UserStatus) {
  const { token, isLoading: authLoading } = useAuth();
  const [list, setList] = useState<PrivilegeDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (authLoading) {
      return;
    }
    if (!token) {
      setList(null);
      setError('Войдите в аккаунт, чтобы загрузить привилегии.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrivileges(token);
      setList(data);
    } catch (e) {
      setList(null);
      setError(e instanceof Error ? e.message : 'Не удалось загрузить привилегии');
    } finally {
      setLoading(false);
    }
  }, [authLoading, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const { active, blocked } = useMemo(() => {
    if (!list) return { active: [], blocked: [] };
    return splitPrivilegesByUser(list, userTier);
  }, [list, userTier]);

  return { active, blocked, loading, error, refetch: load };
}
