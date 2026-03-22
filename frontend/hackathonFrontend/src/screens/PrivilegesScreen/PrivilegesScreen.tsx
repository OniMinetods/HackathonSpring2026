import { PrivilegeItemCard } from '@components/PrivilegesScreenComponents/PrivilegeItemCard';
import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { UserStatus } from 'src/features/auth/api/authTypes';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { PRIVILEGES_BY_TIER } from 'src/features/privileges/model/privilegesData';

function tierTitle(s: UserStatus): string {
  if (s === 'platinum') return 'Black';
  return s[0].toUpperCase() + s.slice(1);
}

export default function PrivilegesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const tier = (user?.status ?? 'silver') as UserStatus;
  const { active, blocked } = PRIVILEGES_BY_TIER[tier];

  return (
    <ImageBackground
      style={styles.bg}
      source={require('../../shared/lib/public/img/sberBackground.png')}
      resizeMode="cover"
    >
      <View style={styles.root}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.back}>← Назад</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.h1}>Привилегии уровня</Text>
        <Text style={styles.sub}>Ваш уровень: {tierTitle(tier)}</Text>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.section}>Активные</Text>
          {active.map((p) => (
            <PrivilegeItemCard key={p.id} item={p} />
          ))}
          <Text style={[styles.section, styles.sectionSecond]}>
            Заблокированные
          </Text>
          {blocked.length === 0 ? (
            <Text style={styles.empty}>Нет заблокированных привилегий</Text>
          ) : (
            blocked.map((p) => <PrivilegeItemCard key={p.id} item={p} />)
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  root: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 12,
    backgroundColor: Colors.black50,
  },
  headerRow: {
    marginBottom: 8,
  },
  back: {
    color: Colors.primaryGreenFourth,
    fontSize: 17,
    fontWeight: '600',
  },
  h1: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sub: {
    color: Colors.primaryGrey,
    fontSize: 15,
    marginBottom: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 12,
  },
  section: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSecond: {
    marginTop: 8,
  },
  empty: {
    color: Colors.primaryGrey,
    fontSize: 15,
    paddingVertical: 8,
  },
});
