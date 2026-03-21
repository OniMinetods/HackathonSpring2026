import { Colors } from '@constants/colors';
import type { UserStatus } from 'src/features/auth/api/authTypes';
import { tierLabelForPdf } from 'src/features/calculator/lib/scenarioModel';
import { StatusIcon } from 'src/shared/lib/icons';
import { StyleSheet, Text, View } from 'react-native';

const statusColor = (s: UserStatus) => {
  switch (s) {
    case 'silver':
      return Colors.silver;
    case 'gold':
      return Colors.gold;
    default:
      return Colors.platinum;
  }
};

export type CalculatorCurrentStatusProps = {
  status: UserStatus;
};

export const CalculatorCurrentStatus = ({
  status,
}: CalculatorCurrentStatusProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.caption}>Текущий статус</Text>
      <View style={styles.row}>
        <StatusIcon color={statusColor(status)} />
        <Text style={styles.tier}>{tierLabelForPdf(status)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  caption: {
    color: Colors.primaryGrey,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tier: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
});
