import { Colors } from '@constants/colors'
import { router } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

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
    fontSize: 18,
    fontWeight: '600',
  },
});

