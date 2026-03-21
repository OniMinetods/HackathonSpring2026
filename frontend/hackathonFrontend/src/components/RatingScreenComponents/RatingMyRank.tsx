import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export const RatingMyRank = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Мой номер в рейтинге</Text>
      <Text style={styles.rank}>7</Text>
      <Text style={styles.hint}>внутри дилерского центра</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: Colors.primaryGrey,
    fontSize: 16,
  },
  rank: {
    color: Colors.primaryGreenFourth,
    fontSize: 56,
    fontWeight: 'bold',
    lineHeight: 62,
  },
  hint: {
    color: Colors.white,
    fontSize: 16,
  },
});
