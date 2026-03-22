import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
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

export default function FinancialEffectScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const bonus = user?.bonus_income_yearly_rub ?? 0;
  const mortgage = user?.mortgage_savings_yearly_rub ?? 0;
  const cashback = user?.cashback_yearly_rub ?? 0;
  const dms = user?.dms_yearly_rub ?? 0;
  const total =
    user?.total_financial_benefit_yearly_rub ?? bonus + mortgage + cashback + dms;

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
