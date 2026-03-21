export const Colors = {
  // Основные цвета
  primaryGrey: '#757575',
  primaryGreenFirst: '#237E38',
  primaryGreenFourth: '#52C367',
  primaryDark: '#101012',
  black: '#000000',
  white: '#ffffff',
  black50: 'rgba(0, 0, 0, 0.5)',

  // Цвета статуса
  silver: '#c4c4c4',
  gold: '#ffd700',
  platinum: '#e5e4e2',
} as const;

export type ColorType = keyof typeof Colors;
