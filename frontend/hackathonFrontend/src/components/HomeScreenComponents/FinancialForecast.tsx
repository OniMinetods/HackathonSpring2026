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
      <Text style={styles.text}>Финансовый прогноз</Text>
      <Text
        style={styles.text}
      >{`При переходе на ${getNextStatus(status)} показан ваш доход и экономия`}</Text>
      <View style={styles.income}>
        <Text style={styles.text}>111,111</Text>
        <Text style={styles.text}>810,000</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: Colors.white,
  },
  income: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Colors.primaryGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
