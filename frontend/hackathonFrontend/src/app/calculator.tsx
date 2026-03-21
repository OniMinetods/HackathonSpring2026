import { View } from 'react-native';
import CalculatorForm from 'src/features/calculator/components/CalculatorForm';

export default function CalculatorScreen() {
  return (
    <View style={{ flex: 1 }}>
      <CalculatorForm />
    </View>
  );
}
