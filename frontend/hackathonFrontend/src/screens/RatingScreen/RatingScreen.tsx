// screens/RatingScreen/RatingScreen.tsx
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
