import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from 'src/features/auth/hooks/useAuth';

export const NameLastname = () => {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
      >{`${user?.first_name} ${user?.last_name}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 4,
  },
  text: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
});
