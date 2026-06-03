
import { ColorItem, ColorTheme } from '../types';

export const generateThemeArray = (count: number, theme: ColorTheme): ColorItem[] => {
  // Linear sequence ensures a perfect gradient when sorted
  const values = Array.from({ length: count }, (_, i) => i / (count - 1));

  // Shuffle values
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  return values.map((val) => {
    let hex = '';
    const saturation = 95;

    switch (theme) {
      case 'GREEN':
        hex = `hsl(120, ${saturation}%, ${5 + (val * 85)}%)`;
        break;
      case 'RAINBOW':
        hex = `hsl(${val * 360}, ${saturation}%, 50%)`;
        break;
      case 'FIRE':
        hex = `hsl(${val * 60}, 100%, 50%)`;
        break;
      case 'OCEAN':
        hex = `hsl(${180 + (val * 60)}, 100%, ${30 + (val * 50)}%)`;
        break;
      case 'RANDOM': {
        const h = Math.floor(Math.random() * 360);
        const s = 80 + Math.floor(Math.random() * 20);
        const l = 30 + Math.floor(Math.random() * 50);
        hex = `hsl(${h}, ${s}%, ${l}%)`;
        break;
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      value: val,
      hex: hex
    };
  });
};
