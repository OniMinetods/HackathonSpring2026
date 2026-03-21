import { UserStatus } from 'src/features/auth/api/authTypes';

export function getNextStatus(status: UserStatus): string {
  switch (status) {
    case 'silver':
      return 'Gold';
    case 'gold':
      return 'Platinum';
    default:
      return '';
  }
}
