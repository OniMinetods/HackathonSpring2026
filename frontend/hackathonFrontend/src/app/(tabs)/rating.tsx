import { useRefreshProfileOnFocus } from 'src/features/auth/hooks/useRefreshProfileOnFocus';
import RatingScreen from '../../screens/RatingScreen/RatingScreen';

export default function RatingTab() {
  useRefreshProfileOnFocus();
  return <RatingScreen />;
}
