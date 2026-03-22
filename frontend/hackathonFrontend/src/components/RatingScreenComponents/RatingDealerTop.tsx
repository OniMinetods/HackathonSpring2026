import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import type { DealerCenterTopRow } from 'src/features/rating/api/dealerCenterRatingTypes';

export type RatingDealerTopProps = {
  loading?: boolean;
  rows: DealerCenterTopRow[];
  currentUserId: number;
  hasDealerCode: boolean;
};

function formatPoints(p: number): string {
  return Number(p).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export const RatingDealerTop = ({
  loading = false,
  rows,
  currentUserId,
  hasDealerCode,
}: RatingDealerTopProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Топ-10 внутри дилера</Text>
      <View style={styles.list}>
        {loading && (
          <Text style={styles.muted}>Загрузка…</Text>
        )}
        {!loading && !hasDealerCode && (
          <Text style={styles.muted}>
            Укажите код дилерского центра в профиле
          </Text>
        )}
        {!loading && hasDealerCode && rows.length === 0 && (
          <Text style={styles.muted}>Пока нет коллег в вашем ДЦ</Text>
        )}
        {!loading &&
          rows.map((r) => (
            <View
              key={r.user_id}
              style={[
                styles.row,
                r.user_id === currentUserId && styles.rowHighlight,
              ]}
            >
              <Text style={styles.place}>{r.rank}</Text>
              <Text style={styles.name}>{r.name}</Text>
              <Text style={styles.points}>{formatPoints(r.total_points)}</Text>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.black50,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  title: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    gap: 8,
  },
  muted: {
    color: Colors.primaryGrey,
    fontSize: 15,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
  },
  rowHighlight: {
    borderWidth: 1,
    borderColor: Colors.primaryGreenFourth,
  },
  place: {
    width: 28,
    color: Colors.primaryGrey,
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
  },
  points: {
    color: Colors.primaryGreenFourth,
    fontSize: 16,
    fontWeight: '600',
  },
});
