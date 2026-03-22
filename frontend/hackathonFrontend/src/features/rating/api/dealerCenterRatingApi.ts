import { API_ROUTES } from '@constants/API_ROUTES';
import type { DealerCenterRatingResponse } from './dealerCenterRatingTypes';

const URL = `${API_ROUTES.local}/api/users/rating/dealer-center/`;

export async function fetchDealerCenterRating(
  accessToken: string | null,
): Promise<DealerCenterRatingResponse> {
  if (!accessToken?.trim()) {
    throw new Error('Учетные данные не были предоставлены.');
  }
  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${accessToken.trim()}`,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg =
      typeof data === 'object' &&
      data !== null &&
      'detail' in data &&
      typeof (data as { detail: unknown }).detail === 'string'
        ? (data as { detail: string }).detail
        : `Ошибка ${response.status}`;
    throw new Error(msg);
  }
  return data as DealerCenterRatingResponse;
}
