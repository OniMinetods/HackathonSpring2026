import { StyleSheet, TextInput, View } from 'react-native';

export default function CalculatorForm() {
  return (
    <View style={styles.container}>
      <TextInput placeholder="Имя пользователя" value={'111'} />

      <TextInput placeholder="Пароль" value={'222'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
  },
});
