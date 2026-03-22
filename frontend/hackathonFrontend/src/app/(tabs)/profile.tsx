import { useRefreshProfileOnFocus } from 'src/features/auth/hooks/useRefreshProfileOnFocus';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';

export default function ProfileTab() {
  useRefreshProfileOnFocus();
  return <ProfileScreen />;
}
