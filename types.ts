export type AlgorithmType = 'BUBBLE' | 'INSERTION' | 'SELECTION' | 'QUICK' | 'MERGE' | 'HEAP' | 'COCKTAIL' | 'GNOME' | 'SHELL' | 'COMB' | 'CYCLE' | 'ODDEVEN' | 'PANCAKE' | 'STOOGE' | 'RADIX' | 'TIM' | 'BOGO';
export type ColorTheme = 'GREEN' | 'RAINBOW' | 'FIRE' | 'OCEAN' | 'CYBERPUNK' | 'SUNSET' | 'NEON_TOXIC' | 'GOLDEN_HOUR' | 'RETRO_WAVE' | 'EMERALD_MINT' | 'AMETHYST' | 'PASTEL_CANDY' | 'RANDOM';
export type VisualShape = 'BAR' | 'BUBBLE' | 'PILL' | 'WAVE';
export type SoundMode = 'CRYSTAL' | 'MARIMBA' | 'RETRO_8BIT' | 'SYNTH_CHORD';

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
