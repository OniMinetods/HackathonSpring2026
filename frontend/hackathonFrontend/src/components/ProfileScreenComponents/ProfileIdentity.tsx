import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export const ProfileIdentity = () => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.name}>Иванов Иван Иванович</Text>
      <Text style={styles.sub}>Идентификация через Sber ID</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 8,
    gap: 8,
  },
  name: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  sub: {
    color: Colors.primaryGrey,
    fontSize: 16,
  },
});
