import { API_ROUTES } from '@constants/API_ROUTES';
import type {
  ScenarioCalculatorRequest,
  ScenarioCalculatorResponse,
} from './scenarioApiTypes';

const SCENARIO_URL = `${API_ROUTES.local}/api/core/scenario-calculator/`;

export async function postScenarioCalculator(
  accessToken: string | null,
  body: ScenarioCalculatorRequest,
  signal?: AbortSignal,
): Promise<ScenarioCalculatorResponse> {
  if (!accessToken?.trim()) {
    throw new Error('Учетные данные не были предоставлены.');
  }

  const response = await fetch(SCENARIO_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${accessToken.trim()}`,
    },
    body: JSON.stringify(body),
    signal,
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

  return data as ScenarioCalculatorResponse;
}
