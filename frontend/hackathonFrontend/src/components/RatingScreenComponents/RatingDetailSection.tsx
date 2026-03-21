import { CalculatorEntryButton } from '@components/CalculatorScreenComponents/CalculatorEntryButton';
import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { RatingMetricBlock } from './RatingMetricBlock';

const COPY = {
  volume: {
    howCalculated:
      'Баллы начисляются за сумму профинансированного объёма сделок за расчётный период по шкале банка.',
    howToIncrease:
      'Увеличивайте объём выдач и средний размер кредита по каждой сделке.',
  },
  deals: {
    howCalculated:
      'Учитывается количество оформленных сделок с продуктами банка за период.',
    howToIncrease: 'Закрывайте больше сделок и подключайте к ним наши продукты.',
  },
  share: {
    howCalculated:
      'Считается доля банка в портфеле финансирования ваших клиентов.',
    howToIncrease:
      'Повышайте долю наших продуктов в каждой сделке и удерживайте клиента в банке.',
  },
} as const;

export const RatingDetailSection = () => {
  const { user } = useAuth();

  const volumePts = user?.volume_points ?? 32;
  const dealsPts = user?.deals_points ?? 18;
  const sharePts = user?.share_points ?? 12;

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>Детализация рейтинга</Text>
      <Text style={styles.sectionHint}>
        Сумма показателей участвует в ежедневном пересчёте рейтинга
      </Text>
      <RatingMetricBlock
        title="Объём"
        points={volumePts}
        howCalculated={COPY.volume.howCalculated}
        howToIncrease={COPY.volume.howToIncrease}
      />
      <RatingMetricBlock
        title="Сделки"
        points={dealsPts}
        howCalculated={COPY.deals.howCalculated}
        howToIncrease={COPY.deals.howToIncrease}
      />
      <RatingMetricBlock
        title="Доля банка"
        points={sharePts}
        howCalculated={COPY.share.howCalculated}
        howToIncrease={COPY.share.howToIncrease}
      />
      <CalculatorEntryButton title="Смоделировать рост" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionHint: {
    color: Colors.primaryGrey,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});
