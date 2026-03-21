import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type CalculatorEntryButtonProps = {
  title: string;
};

export const CalculatorEntryButton = ({ title }: CalculatorEntryButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => router.push('/calculator')}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: Colors.primaryGreenFirst,
  },
  text: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
