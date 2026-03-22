/** Ответ API GET /api/core/privileges/ */
export type PrivilegeDto = {
  name: string;
  short_description: string;
  financial_effect_rub: string;
  role: string;
};

/** Элемент для UI-карточки */
export type PrivilegeItem = {
  id: string;
  title: string;
  description: string;
  financialRub: number;
  statusText: string;
};
