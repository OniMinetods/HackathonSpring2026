import { API_ROUTES } from '@constants/API_ROUTES';
import type { PrivilegeDto } from 'src/features/privileges/model/privilegeTypes';

const PRIVILEGES_URL = `${API_ROUTES.local}/api/core/privileges/`;

/** DRF TokenAuthentication: заголовок `Authorization: Token <key>`. */
export async function fetchPrivileges(
  accessToken: string | null,
): Promise<PrivilegeDto[]> {
  if (!accessToken?.trim()) {
    throw new Error('Учетные данные не были предоставлены.');
  }

  const response = await fetch(PRIVILEGES_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${accessToken.trim()}`,
    },
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('Не удалось разобрать ответ сервера');
  }

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

  if (!Array.isArray(data)) {
    throw new Error('Некорректный ответ сервера');
  }

  return data as PrivilegeDto[];
}
