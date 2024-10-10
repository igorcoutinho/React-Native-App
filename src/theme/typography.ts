export const FontFamily = {
  default: 'Varela Round',
};

export type TypographyFontSizeKeys = keyof typeof FontSize;

export enum FontSize {
  'large' = 20,
  'medium' = 16,
  'regular' = 14,
  'small' = 12,
  'xLarge' = 24,
  'xSmall' = 10,
  'x2Small' = 8,
}
