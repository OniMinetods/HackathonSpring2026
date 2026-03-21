import { Colors } from '@constants/colors'
import { StyleSheet, Text, View } from 'react-native'

export type TaskMonthItemProps = {
  title: string;
  pointsHint: string;
  progress: number;
  deadline: string;
  reward: string;
};

export const TaskMonthItem = ({
  title,
  pointsHint,
  progress,
  deadline,
  reward,
}: TaskMonthItemProps) => {
  const width = `${Math.min(Math.max(progress, 0), 1) * 100}%` as const;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{pointsHint}</Text>
      </View>
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: width }]} />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{deadline}</Text>
        <Text style={styles.metaAccent}>{reward}</Text>
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
  headerRow: {
    gap: 6,
  },
  title: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '600',
  },
  hint: {
    color: Colors.primaryGrey,
    fontSize: 16,
  },
  progressBackground: {
    height: 10,
    backgroundColor: Colors.primaryGrey,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: Colors.primaryGreenFourth,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    color: Colors.primaryGrey,
    fontSize: 16,
  },
  metaAccent: {
    color: Colors.primaryGreenFourth,
    fontSize: 16,
    fontWeight: '600',
  },
});
