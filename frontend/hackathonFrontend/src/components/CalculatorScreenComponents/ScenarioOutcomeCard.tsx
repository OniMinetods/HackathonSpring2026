import { Colors } from '@constants/colors'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import type { ScenarioCalculatorResponse } from 'src/features/calculator/api/scenarioApiTypes'

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
  loading: boolean;
  error: string | null;
  outcome: ScenarioCalculatorResponse | null;
};

function formatDelta(v: number): string {
  const s = v >= 0 ? `+${v}` : `${v}`;
  return `${s} баллов`;
}

export const ScenarioOutcomeCard = ({
  loading,
  error,
  outcome,
}: ScenarioOutcomeCardProps) => {
  const incomeStr =
    outcome?.yearly_income_rub.toLocaleString('ru-RU') ?? '—';
  const savingsStr =
    outcome?.mortgage_savings_rub.toLocaleString('ru-RU') ?? '—';

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Пересчёт</Text>
      <Text style={styles.sectionHint}>обновляется при движении ползунков</Text>

      {loading && (
        <View style={styles.centerRow}>
          <ActivityIndicator color={Colors.primaryGreenFourth} />
          <Text style={styles.hint}>Считаем на сервере…</Text>
        </View>
      )}

      {error && !loading && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!error && outcome && (
        <View style={[styles.block, loading && styles.blockDimmed]}>
          <Row
            title="Исходные баллы (с клиента)"
            value={`${outcome.total_points} баллов`}
          />
          <View style={styles.divider} />
          <Row
            title="Новый рейтинг"
            value={`${outcome.projected_total_points} баллов`}
            accent
          />
          <View style={styles.divider} />
          <Row title="Изменение" value={formatDelta(outcome.delta_points)} />
          <View style={styles.divider} />
          <Row
            title="Новый уровень"
            value={outcome.projected_tier_label}
            accent
          />
          <View style={styles.divider} />
          <Row title="Новый доход (год)" value={`${incomeStr} ₽`} />
          <View style={styles.divider} />
          <Row title="Новая экономия (ипотека)" value={`${savingsStr} ₽`} />
        </View>
      )}
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
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  hint: {
    color: Colors.primaryGrey,
    fontSize: 15,
  },
  errorText: {
    color: '#ff8a80',
    fontSize: 15,
    paddingVertical: 8,
  },
  block: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  blockDimmed: {
    opacity: 0.55,
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
