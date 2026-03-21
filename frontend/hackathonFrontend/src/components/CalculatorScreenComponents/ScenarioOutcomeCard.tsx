import { Colors } from '@constants/colors';
import type { UserStatus } from 'src/features/auth/api/authTypes';
import { tierLabelForPdf } from 'src/features/calculator/lib/scenarioModel';
import { StyleSheet, Text, View } from 'react-native';

type RowProps = { title: string; value: string; accent?: boolean };

const Row = ({ title, value, accent }: RowProps) => (
  <View style={[styles.row, accent && styles.rowAccent]}>
    <Text style={styles.rowTitle}>{title}</Text>
    <Text style={[styles.rowValue, accent && styles.rowValueAccent]}>
      {value}
    </Text>
  </View>
);

export type ScenarioOutcomeCardProps = {
  ratingPoints: number;
  projectedStatus: UserStatus;
  yearlyIncomeRub: number;
  mortgageSavingsRub: number;
};

export const ScenarioOutcomeCard = ({
  ratingPoints,
  projectedStatus,
  yearlyIncomeRub,
  mortgageSavingsRub,
}: ScenarioOutcomeCardProps) => {
  const incomeStr = yearlyIncomeRub.toLocaleString('ru-RU');
  const savingsStr = mortgageSavingsRub.toLocaleString('ru-RU');

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Пересчёт</Text>
      <Text style={styles.sectionHint}>обновляется при движении ползунков</Text>
      <View style={styles.block}>
        <Row title="Новый рейтинг" value={`${ratingPoints} баллов`} accent />
        <View style={styles.divider} />
        <Row
          title="Новый уровень"
          value={tierLabelForPdf(projectedStatus)}
          accent
        />
        <View style={styles.divider} />
        <Row title="Новый доход (год)" value={`${incomeStr} ₽`} />
        <View style={styles.divider} />
        <Row title="Новая экономия (ипотека)" value={`${savingsStr} ₽`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.black50,
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionHint: {
    color: Colors.primaryGrey,
    fontSize: 14,
    marginBottom: 8,
  },
  block: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowAccent: {},
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
