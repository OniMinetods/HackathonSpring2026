import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';

const ROWS: { place: number; name: string; points: string }[] = [
  { place: 1, name: 'Смирнов А.', points: '412' },
  { place: 2, name: 'Козлова Е.', points: '398' },
  { place: 3, name: 'Петров Д.', points: '385' },
  { place: 4, name: 'Новикова М.', points: '371' },
  { place: 5, name: 'Волков И.', points: '360' },
  { place: 6, name: 'Орлова К.', points: '348' },
  { place: 7, name: 'Иванов И.', points: '336' },
  { place: 8, name: 'Соколов П.', points: '322' },
  { place: 9, name: 'Лебедева А.', points: '310' },
  { place: 10, name: 'Морозов С.', points: '298' },
];

export const RatingDealerTop = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Топ-10 внутри дилера</Text>
      <View style={styles.list}>
        {ROWS.map((r) => (
          <View
            key={r.place}
            style={[styles.row, r.place === 7 && styles.rowHighlight]}
          >
            <Text style={styles.place}>{r.place}</Text>
            <Text style={styles.name}>{r.name}</Text>
            <Text style={styles.points}>{r.points}</Text>
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
