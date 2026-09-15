
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
        hex = `hsl(120, ${saturation}%, ${15 + (val * 70)}%)`;
        break;
      case 'RAINBOW':
        hex = `hsl(${val * 360}, ${saturation}%, 52%)`;
        break;
      case 'FIRE':
        // Deep crimson to flaming amber
        hex = `hsl(${val * 50}, 100%, ${40 + (val * 20)}%)`;
        break;
      case 'OCEAN':
        // Deep abyss navy to bright electric cyan
        hex = `hsl(${190 + (val * 50)}, 100%, ${28 + (val * 45)}%)`;
        break;
      case 'CYBERPUNK':
        // Neon cyan through magenta to electric purple
        hex = `hsl(${180 + (val * 120)}, 100%, ${45 + (val * 15)}%)`;
        break;
      case 'SUNSET':
        // Purple nightfall to blazing orange and golden yellow
        hex = `hsl(${280 - (val * 240)}, 95%, ${45 + (val * 15)}%)`;
        break;
      case 'NEON_TOXIC':
        // Radioactive lime to neon turquoise
        hex = `hsl(${85 + (val * 85)}, 100%, ${45 + (val * 15)}%)`;
        break;
      case 'GOLDEN_HOUR':
        // Warm cinematic bronze to bright radiant gold
        hex = `hsl(${25 + (val * 30)}, 95%, ${30 + (val * 40)}%)`;
        break;
      case 'RETRO_WAVE':
        // Vaporwave hot pink to neon sky blue
        hex = `hsl(${320 - (val * 130)}, 95%, ${50 + (val * 10)}%)`;
        break;
      case 'EMERALD_MINT':
        // Forest jade to icy mint green
        hex = `hsl(${150 + (val * 30)}, 90%, ${25 + (val * 50)}%)`;
        break;
      case 'AMETHYST':
        // Deep royal indigo to luminous violet
        hex = `hsl(${260 + (val * 35)}, 90%, ${30 + (val * 45)}%)`;
        break;
      case 'PASTEL_CANDY':
        // Vibrant candy pastel spectrum
        hex = `hsl(${val * 360}, 85%, 65%)`;
        break;
      case 'RANDOM': {
        const baseHue = Math.floor(Math.random() * 360);
        hex = `hsl(${(baseHue + val * 160) % 360}, 95%, ${40 + val * 30}%)`;
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
