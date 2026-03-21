export const Colors = {
  // Основные цвета
  primaryGrey: '#757575',
  primaryGreenFirst: '#237E38',
  primaryDark: '#101012',
  black: '#000000',
  white: '#ffffff',

  // Цвета статуса
  silver: '#c4c4c4',
  gold: '#ffd700',
  platinum: '#e5e4e2',
} as const;

export type ColorType = keyof typeof Colors;
