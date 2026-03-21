import type { UserStatus } from 'src/features/auth/api/authTypes';

/** Баллы за единицу сценария (согласовано с разбивкой рейтинга в ТЗ). */
export const POINTS_PER_EXTRA_DEAL = 6;
export const POINTS_PER_MILLION_VOLUME = 10;
export const POINTS_PER_SHARE_5_PERCENT = 5;
export const POINTS_PER_EXTRA_PRODUCT = 4;

/** Пороги суммарных баллов → уровень (в приложении верхний уровень — platinum, в ТЗ — Black). */
export const GOLD_POINTS_THRESHOLD = 160;
export const BLACK_POINTS_THRESHOLD = 300;

export function statusFromTotalPoints(total: number): UserStatus {
  const t = Math.max(0, total);
  if (t < GOLD_POINTS_THRESHOLD) return 'silver';
  if (t < BLACK_POINTS_THRESHOLD) return 'gold';
  return 'platinum';
}

export function tierLabelForPdf(status: UserStatus): string {
  switch (status) {
    case 'silver':
      return 'Silver';
    case 'gold':
      return 'Gold';
    case 'platinum':
      return 'Black';
  }
}

export type ScenarioSlidersState = {
  extraDeals: number;
  extraVolumeMillion: number;
  extraShareSteps: number;
  extraProducts: number;
};

export type ScenarioOutcome = {
  basePoints: number;
  projectedPoints: number;
  deltaPoints: number;
  projectedStatus: UserStatus;
  yearlyIncomeRub: number;
  mortgageSavingsRub: number;
};

export function computeScenario(
  baseTotalPoints: number,
  sliders: ScenarioSlidersState,
): ScenarioOutcome {
  const safeBase = Math.max(0, Math.round(baseTotalPoints));
  const delta =
    sliders.extraDeals * POINTS_PER_EXTRA_DEAL +
    sliders.extraVolumeMillion * POINTS_PER_MILLION_VOLUME +
    sliders.extraShareSteps * POINTS_PER_SHARE_5_PERCENT +
    sliders.extraProducts * POINTS_PER_EXTRA_PRODUCT;

  const projectedPoints = safeBase + delta;
  const projectedStatus = statusFromTotalPoints(projectedPoints);

  const yearlyIncomeRub = estimateYearlyIncome(projectedPoints, projectedStatus);
  const mortgageSavingsRub = estimateMortgageSavings(
    projectedPoints,
    projectedStatus,
  );

  return {
    basePoints: safeBase,
    projectedPoints,
    deltaPoints: delta,
    projectedStatus,
    yearlyIncomeRub,
    mortgageSavingsRub,
  };
}

function estimateYearlyIncome(totalPoints: number, status: UserStatus): number {
  const tierBase =
    status === 'silver' ? 120_000 : status === 'gold' ? 260_000 : 420_000;
  return Math.round(tierBase + totalPoints * 3800);
}

function estimateMortgageSavings(
  totalPoints: number,
  status: UserStatus,
): number {
  const tierBase =
    status === 'silver' ? 380_000 : status === 'gold' ? 560_000 : 740_000;
  return Math.round(tierBase + totalPoints * 6200);
}
