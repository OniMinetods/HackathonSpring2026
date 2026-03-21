import { Colors } from '@constants/colors';
import { numberParser } from 'src/shared/functions';
import { StyleSheet, Text, View } from 'react-native';

export type RatingMetricBlockProps = {
  title: string;
  points: number;
  howCalculated: string;
  howToIncrease: string;
};

export const RatingMetricBlock = ({
  title,
  points,
  howCalculated,
  howToIncrease,
}: RatingMetricBlockProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.headline}>
        {title} → {points} {numberParser(points)}
      </Text>
      <Text style={styles.subLabel}>Как рассчитывается</Text>
      <Text style={styles.body}>{howCalculated}</Text>
      <Text style={styles.subLabel}>Как увеличить</Text>
      <Text style={styles.body}>{howToIncrease}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  headline: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subLabel: {
    color: Colors.primaryGreenFourth,
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    color: Colors.primaryGrey,
    fontSize: 15,
    lineHeight: 22,
  },
});
