import { Colors } from '@constants/colors';
import { type Href, useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type GreenStackButtonProps = {
  title: string;
  href: Href;
  style?: StyleProp<ViewStyle>;
};

export const GreenStackButton = ({ title, href, style }: GreenStackButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.btn, style]}
      onPress={() => router.push(href)}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'center',
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  text: {
    textAlign: 'center',
    color: Colors.black,
    fontSize: 17,
    fontWeight: '600',
  },
});
