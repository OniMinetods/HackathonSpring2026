import { API_ROUTES } from '@constants/API_ROUTES';
import type { DailyResultDto } from './dailyResultTypes';

const BASE = `${API_ROUTES.local}/api/core/daily-result/today/`;

export async function fetchDailyResultToday(
  accessToken: string | null,
): Promise<DailyResultDto> {
  if (!accessToken?.trim()) {
    throw new Error('Учетные данные не были предоставлены.');
  }
  const response = await fetch(BASE, {
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
  return data as DailyResultDto;
}

export type DailyResultSavePayload = {
  deals_count: number;
  credit_volume_million: number;
  extra_products_count: number;
};

export async function saveDailyResultToday(
  accessToken: string | null,
  body: DailyResultSavePayload,
): Promise<DailyResultDto> {
  if (!accessToken?.trim()) {
    throw new Error('Учетные данные не были предоставлены.');
  }
  const response = await fetch(BASE, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${accessToken.trim()}`,
    },
    body: JSON.stringify(body),
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
  return data as DailyResultDto;
}
