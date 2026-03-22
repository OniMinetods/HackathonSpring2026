import { useRefreshProfileOnFocus } from 'src/features/auth/hooks/useRefreshProfileOnFocus'
import HomeScreen from '../../screens/HomeScreen/HomeScreen'

export default function HomeTab() {
  useRefreshProfileOnFocus();
  return <HomeScreen />;
}
