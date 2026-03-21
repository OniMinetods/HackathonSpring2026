// screens/RatingScreen/RatingScreen.tsx
import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export default function RatingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Рейтинг</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
