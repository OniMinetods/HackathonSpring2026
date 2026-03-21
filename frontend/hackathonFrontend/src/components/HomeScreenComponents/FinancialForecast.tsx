import { Colors } from '@constants/colors';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserStatus } from 'src/features/auth/api/authTypes';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { getNextStatus } from 'src/shared/functions';

export const FinancialForecast = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<UserStatus>('silver');

  useEffect(() => {
    if (user) setStatus(user.status);
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Финансовый прогноз</Text>
      <Text
        style={styles.subtitle}
      >{`При переходе на ${getNextStatus(status)} показан ваш доход и экономия`}</Text>
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Годовой доход</Text>
          <Text style={styles.metricValue}>111,111 ₽</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Экономия на ипотеке</Text>
          <Text style={styles.metricValue}>810,000 ₽</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black50,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primaryGrey,
    lineHeight: 22,
  },
  metrics: {
    marginTop: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.primaryDark,
    gap: 16,
  },
  metric: {
    gap: 6,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.primaryGrey,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
  },
  metricDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
