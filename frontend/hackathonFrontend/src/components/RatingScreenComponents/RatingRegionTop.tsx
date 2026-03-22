import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import type { DealerTotalsTopRow } from 'src/features/rating/api/dealerCenterRatingTypes';

export type RatingRegionTopProps = {
  loading?: boolean;
  rows: DealerTotalsTopRow[];
  myDealerCode: string;
};

function formatSum(p: number): string {
  return Math.round(p).toLocaleString('ru-RU');
}

export const RatingRegionTop = ({
  loading = false,
  rows,
  myDealerCode,
}: RatingRegionTopProps) => {
  const myTrim = myDealerCode.trim();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Топ региона</Text>
      <Text style={styles.subtitle}>по сумме баллов дилеров</Text>
      <View style={styles.list}>
        {loading && (
          <Text style={styles.muted}>Загрузка…</Text>
        )}
        {!loading && rows.length === 0 && (
          <Text style={styles.muted}>Нет данных по кодам ДЦ</Text>
        )}
        {!loading &&
          rows.map((item) => (
            <View
              key={item.dealer_code}
              style={[
                styles.row,
                myTrim !== '' && item.dealer_code === myTrim && styles.rowHighlight,
              ]}
            >
              <Text style={styles.place}>{item.rank}</Text>
              <Text style={styles.center} numberOfLines={1}>
                ДЦ · {item.dealer_code}
              </Text>
              <Text style={styles.points}>{formatSum(item.total_points_sum)}</Text>
            </View>
          ))}
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
  title: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.primaryGrey,
    fontSize: 14,
    marginBottom: 4,
  },
  list: {
    gap: 10,
  },
  muted: {
    color: Colors.primaryGrey,
    fontSize: 15,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: Colors.black50,
  },
  rowHighlight: {
    borderWidth: 1,
    borderColor: Colors.primaryGreenFourth,
  },
  place: {
    width: 24,
    color: Colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
  },
  points: {
    color: Colors.primaryGreenFourth,
    fontSize: 15,
    fontWeight: '600',
  },
});
