export type AlgorithmType = 'BUBBLE' | 'INSERTION' | 'SELECTION' | 'QUICK' | 'MERGE' | 'HEAP' | 'COCKTAIL';
export type ColorTheme = 'GREEN' | 'RAINBOW' | 'FIRE' | 'OCEAN';
export type VisualShape = 'BAR' | 'BUBBLE';

export interface ColorItem {
  id: string;
  hex: string;
  value: number; // 0 to 1
}

export interface SortStep {
  array: ColorItem[];
  comparingIndices: number[];
  swappingIndices: number[];
  activeIndices: number[];
  pivotIndex?: number;
  currentLine?: number;
}

export interface AlgorithmMetadata {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string[];
}
