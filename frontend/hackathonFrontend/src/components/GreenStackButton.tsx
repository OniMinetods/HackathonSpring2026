import { Colors } from '@constants/colors';
import { type Href, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type GreenStackButtonProps = {
  title: string;
  href: Href;
};

export const GreenStackButton = ({ title, href }: GreenStackButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => router.push(href)}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 12,
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
