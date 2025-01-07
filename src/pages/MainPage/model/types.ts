export interface Palette {}

export type ColorCounts = { [key: string]: number };

export interface SortedColor {
  r: number;
  g: number;
  b: number;
  count: number;
  diffFromWhite: number;
}
