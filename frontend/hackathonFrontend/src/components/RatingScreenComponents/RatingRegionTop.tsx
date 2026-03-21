import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';

const TOP = [
  { place: 1, center: 'ДЦ «Север»', points: '12 480' },
  { place: 2, center: 'ДЦ «Запад»', points: '11 902' },
  { place: 3, center: 'ДЦ «Восток»', points: '11 540' },
];

export const RatingRegionTop = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Топ региона</Text>
      <Text style={styles.subtitle}>по сумме баллов дилеров</Text>
      <View style={styles.list}>
        {TOP.map((item) => (
          <View key={item.place} style={styles.row}>
            <Text style={styles.place}>{item.place}</Text>
            <Text style={styles.center}>{item.center}</Text>
            <Text style={styles.points}>{item.points}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: Colors.black50,
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
