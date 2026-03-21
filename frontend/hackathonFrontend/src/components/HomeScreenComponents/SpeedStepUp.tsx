import { Colors } from '@constants/colors';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export const SpeedStepUp = () => {
  const handlePress = () => {
    router.push('/calculator');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.text}>Как ускорить переход ?</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: Colors.primaryGreenFirst,
  },
  text: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
