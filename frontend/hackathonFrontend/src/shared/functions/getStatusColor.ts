import { Colors } from '@constants/colors';
import { UserStatus } from 'src/features/auth/api/authTypes';

export function getStatusColor(status: UserStatus) {
  switch (status) {
    case 'silver':
      return Colors.silver;
    case 'gold':
      return Colors.gold;
    case 'platinum':
      return Colors.platinum;
  }
}
