import { Colors } from '@constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { fetchPrivileges } from 'src/features/privileges/api/privilegesApi';

export default function PrivilegeDetailScreen() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const params = useLocalSearchParams<{
    id?: string | string[];
    title?: string | string[];
  }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const nameKey = rawId
    ? (() => {
        try {
          return decodeURIComponent(rawId);
        } catch {
          return rawId;
        }
      })()
    : undefined;
  const rawTitle = Array.isArray(params.title) ? params.title[0] : params.title;
  const title = rawTitle
    ? (() => {
        try {
          return decodeURIComponent(rawTitle);
        } catch {
          return rawTitle;
        }
      })()
    : undefined;

  const [body, setBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!nameKey) {
        setBody('');
        setLoading(false);
        return;
      }
      if (authLoading) {
        return;
      }
      if (!token) {
        setErr('Войдите в аккаунт, чтобы загрузить описание.');
        setBody('');
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr(null);
      try {
        const list = await fetchPrivileges(token);
        const found = list.find((p) => p.name === nameKey);
        if (!cancelled) {
          setBody(found?.short_description ?? '');
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : 'Ошибка загрузки');
          setBody('');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nameKey, token, authLoading]);

  return (
    <ImageBackground
      style={styles.bg}
      source={require('../shared/lib/public/img/sberBackground.png')}
      resizeMode="cover"
    >
      <View style={styles.root}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Назад</Text>
        </TouchableOpacity>
        {title ? <Text style={styles.h1}>{title}</Text> : null}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.primaryGreenFourth} />
          </View>
        ) : err ? (
          <Text style={styles.error}>{err}</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.body}>
              {body?.trim()
                ? body
                : 'Описание недоступно.'}
            </Text>
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  root: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: Colors.black50,
    gap: 12,
  },
  back: {
    color: Colors.primaryGreenFourth,
    fontSize: 20,
    fontWeight: '600',
  },
  h1: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  center: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  error: {
    color: '#ff8a80',
    fontSize: 15,
  },
  scroll: { paddingBottom: 40 },
  body: {
    color: Colors.primaryGrey,
    fontSize: 16,
    lineHeight: 24,
  },
});
