/** Тело POST /api/core/scenario-calculator/ (синхрон с ScenarioCalculatorInputSerializer). */
export type ScenarioCalculatorRequest = {
  total_points: number;
  extra_deals?: number;
  extra_volume_million?: number;
  extra_share_steps?: number;
  extra_products?: number;
};

/** Ответ scenario_calculate() в core. */
export type ScenarioCalculatorResponse = {
  total_points: number;
  projected_total_points: number;
  delta_points: number;
  projected_status: string;
  projected_tier_label: string;
  yearly_income_rub: number;
  mortgage_savings_rub: number;
};
