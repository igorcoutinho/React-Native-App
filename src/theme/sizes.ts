export type SizeKeys = keyof typeof Size;

export enum Size {
  'large' = 20,
  'medium' = 16,
  'regular' = 14,
  'small' = 12,
  'x2Large' = 40,
  'xLarge' = 30,
  'xSmall' = 10,
  'x2Small' = 5,
}

export type GapKeys = keyof typeof Gap;

export enum Gap {
  'large' = 25,
  'medium' = 20,
  'regular' = 15,
  'small' = 10,
  'xLarge' = 30,
  'xSmall' = 5,
  'x2Small' = 2,
}
