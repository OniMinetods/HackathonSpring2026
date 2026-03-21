import { View } from 'react-native';
import LoginForm from '../features/auth/components/LoginForm';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LoginForm />
    </View>
  );
}
