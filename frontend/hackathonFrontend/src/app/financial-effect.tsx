import { Colors } from '@constants/colors';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
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

function formatRub(n: number): string {
  return Math.round(n).toLocaleString('ru-RU');
}

/** DRF может отдать число или строку. */
function num(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) {
    return v;
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const parsed = parseFloat(v.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export default function FinancialEffectScreen() {
  const router = useRouter();
  const { token, user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token?.trim()) {
      setError('Войдите в аккаунт, чтобы загрузить данные.');
      setLoading(false);
      return;
    }
    setLoading(true);
    const u = await refreshProfile();
    if (!u) {
      setError('Не удалось загрузить данные профиля с сервера.');
    } else {
      setError(null);
    }
    setLoading(false);
  }, [token, refreshProfile]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const bonus = num(user?.bonus_income_yearly_rub);
  const mortgage = num(user?.mortgage_savings_yearly_rub);
  const cashback = num(user?.cashback_yearly_rub);
  const dms = num(user?.dms_yearly_rub);
  const sumParts = bonus + mortgage + cashback + dms;
  const apiTotal = num(user?.total_financial_benefit_yearly_rub);
  const total = apiTotal || sumParts;

  const year = new Date().getFullYear();

  return (
    <ImageBackground
      style={styles.background}
      source={require('../shared/lib/public/img/sberBackground.png')}
      resizeMode="cover"
    >
      <View style={styles.root}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.back}>Назад</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.screenTitle}>Личный финансовый эффект</Text>
        {error && !loading && (
          <Text style={styles.errorBanner}>{error}</Text>
        )}
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.primaryGreenFourth} />
            <Text style={styles.loadingText}>Загрузка данных…</Text>
          </View>
        )}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroBlock}>
            <Text style={styles.heroLead}>
              {`Ваша общая выгода в ${year} году`}
            </Text>
            <Text style={styles.heroSum}>{`${formatRub(total)} ₽`}</Text>
          </View>

          <View style={styles.block}>
            <Row
              title="Доп. доход от бонусов"
              value={`${formatRub(bonus)} ₽`}
            />
            <View style={styles.divider} />
            <Row
              title="Экономия по ипотеке"
              value={`${formatRub(mortgage)} ₽`}
            />
            <View style={styles.divider} />
            <Row title="Кэшбэк" value={`${formatRub(cashback)} ₽`} />
            <View style={styles.divider} />
            <Row title="ДМС стоимость" value={`${formatRub(dms)} ₽`} />
            <View style={styles.divider} />
            <Row
              title="Общая выгода за год"
              value={`${formatRub(total)} ₽`}
              accent
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

function Row({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={[styles.rowValue, accent && styles.rowValueAccent]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
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
  topBar: {
    marginBottom: 8,
  },
  back: {
    color: Colors.primaryGreenFourth,
    fontSize: 20,
    fontWeight: '600',
  },
  screenTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorBanner: {
    color: '#ff8a80',
    fontSize: 14,
    marginBottom: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  loadingText: {
    color: Colors.primaryGrey,
    fontSize: 15,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 20,
  },
  heroBlock: {
    gap: 8,
  },
  heroLead: {
    color: Colors.primaryGrey,
    fontSize: 17,
    lineHeight: 24,
  },
  heroSum: {
    color: Colors.white,
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  block: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowTitle: {
    flex: 1,
    color: Colors.primaryGrey,
    fontSize: 15,
  },
  rowValue: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  rowValueAccent: {
    color: Colors.primaryGreenFourth,
    fontSize: 17,
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
