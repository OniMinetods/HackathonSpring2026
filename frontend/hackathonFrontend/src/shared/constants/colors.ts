export const Colors = {
  // Основные цвета
  primaryGrey: '#757575',
  primaryGreenFirst: '#237E38',
  primaryDark: '#101012',
} as const;

export type ColorType = keyof typeof Colors;
