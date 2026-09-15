
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlgorithmType, ColorItem, SortStep, ColorTheme, VisualShape } from './types';
import { ALGORITHM_DATA } from './constants';
import { generateThemeArray } from './utils/colorHelper';
import { audioService } from './utils/audioService';
import {
  bubbleSort,
  insertionSort,
  selectionSort,
  quickSort,
  mergeSort,
  heapSort,
  cocktailShakerSort,
  gnomeSort,
  shellSort,
  combSort,
  cycleSort,
  oddEvenSort,
  pancakeSort,
  stoogeSort,
  radixSort,
  timSort,
  bogoSort
} from './services/sortingService';

declare global {
  interface Window {
    startSorting: () => void;
    isSortingCompleted: boolean;
  }
}

const App: React.FC = () => {
  const [arraySize, setArraySize] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('size') || '20');
  });
  const [speed, setSpeed] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('speed') || '85');
  });
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(() => {
    const params = new URLSearchParams(window.location.search);
    const alg = params.get('algorithm');
    return (alg && Object.keys(ALGORITHM_DATA).includes(alg)) ? (alg as AlgorithmType) : 'BUBBLE';
  });
  const [theme, setTheme] = useState<ColorTheme>(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('theme');
    const validThemes: ColorTheme[] = ['GREEN', 'RAINBOW', 'FIRE', 'OCEAN', 'CYBERPUNK', 'SUNSET', 'NEON_TOXIC', 'GOLDEN_HOUR', 'RETRO_WAVE', 'EMERALD_MINT', 'AMETHYST', 'PASTEL_CANDY', 'RANDOM'];
    return (t && validThemes.includes(t as ColorTheme)) ? (t as ColorTheme) : 'CYBERPUNK';
  });
  const [shape, setShape] = useState<VisualShape>(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('shape');
    return (s && ['BAR', 'BUBBLE', 'PILL', 'WAVE'].includes(s)) ? (s as VisualShape) : 'PILL';
  });
  const [soundMode, setSoundMode] = useState<SoundMode>(() => {
    const params = new URLSearchParams(window.location.search);
    const sm = params.get('sound');
    return (sm && ['CRYSTAL', 'MARIMBA', 'RETRO_8BIT', 'SYNTH_CHORD'].includes(sm)) ? (sm as SoundMode) : 'CRYSTAL';
  });

  const [hideUI, setHideUI] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('hideUI') === 'true';
  });

  const [isAutoLoop, setIsAutoLoop] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('auto') === 'true';
  });

  const [items, setItems] = useState<ColorItem[]>(() => generateThemeArray(arraySize, theme));
  const [isSorting, setIsSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState<SortStep | null>(null);
  const [completed, setCompleted] = useState(false);

  // Initialize audio context on user interaction
  useEffect(() => {
    const initAudio = () => audioService.init();
    window.addEventListener('click', initAudio);
    window.addEventListener('keydown', initAudio);
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  const sortingGeneratorRef = useRef<Generator<SortStep> | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const lastArrayRef = useRef<ColorItem[]>([]);

  const resetArray = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const newItems = generateThemeArray(arraySize, theme);
    setItems(newItems);
    lastArrayRef.current = newItems;
    setIsSorting(false);
    setCurrentStep(null);
    setCompleted(false);
    sortingGeneratorRef.current = null;
  }, [arraySize, theme]);

  useEffect(() => {
    resetArray();
  }, [resetArray]);

  const startSorting = () => {
    // Attempt audio init again just in case
    audioService.init();
    audioService.setSoundMode(soundMode);

    if (completed) {
      resetArray();
      return;
    }
    if (!sortingGeneratorRef.current) {
      const sortingServiceMap: Record<AlgorithmType, (arr: ColorItem[]) => Generator<SortStep>> = {
        BUBBLE: bubbleSort,
        INSERTION: insertionSort,
        SELECTION: selectionSort,
        QUICK: quickSort,
        MERGE: mergeSort,
        HEAP: heapSort,
        COCKTAIL: cocktailShakerSort,
        GNOME: gnomeSort,
        SHELL: shellSort,
        COMB: combSort,
        CYCLE: cycleSort,
        ODDEVEN: oddEvenSort,
        PANCAKE: pancakeSort,
        STOOGE: stoogeSort,
        RADIX: radixSort,
        TIM: timSort,
        BOGO: bogoSort
      };
      // We start from the current items state
      sortingGeneratorRef.current = sortingServiceMap[algorithm]([...items]);
    }
    setIsSorting(true);
  };

  const pauseSorting = () => {
    setIsSorting(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const randomizeAndStart = useCallback(() => {
    const algos = Object.keys(ALGORITHM_DATA) as AlgorithmType[];
    const themes: ColorTheme[] = ['GREEN', 'RAINBOW', 'FIRE', 'OCEAN'];
    const randomAlgo = algos[Math.floor(Math.random() * algos.length)];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setAlgorithm(randomAlgo);
    setTheme(randomTheme);
    setCompleted(false);
    resetArray();
    setTimeout(startSorting, 500);
  }, [resetArray]);

  const step = useCallback(() => {
    if (!sortingGeneratorRef.current || !isSorting) return;

    const result = sortingGeneratorRef.current.next();
    if (!result.done) {
      const stepData = result.value;
      setCurrentStep(stepData);
      lastArrayRef.current = [...stepData.array];

      if (stepData.swappingIndices.length > 0) {
        audioService.playNote(stepData.array[stepData.swappingIndices[0]].value, 'swap', stepData.swappingIndices[0], lastArrayRef.current.length);
      } else if (stepData.comparingIndices.length > 0) {
        audioService.playNote(stepData.array[stepData.comparingIndices[0]].value, 'compare', stepData.comparingIndices[0], lastArrayRef.current.length);
      }

      const delay = Math.max(5, 500 - (speed * 5.2));
      timeoutRef.current = window.setTimeout(step, delay);
    } else {
      setItems([...lastArrayRef.current]);
      setIsSorting(false);
      setCompleted(true);
      setCurrentStep(null);
      audioService.playNote(1.0, 'complete', lastArrayRef.current.length / 2, lastArrayRef.current.length);

      // Auto-randomize and loop for "forever" visualization if enabled
      if (isAutoLoop) {
        setTimeout(randomizeAndStart, 3000);
      }
    }
  }, [isSorting, speed, randomizeAndStart, isAutoLoop]);

  useEffect(() => {
    if (isSorting) step();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [isSorting, step]);

  useEffect(() => {
    window.startSorting = startSorting;
    window.isSortingCompleted = completed;
    (window as any).audioService = audioService;
  }, [startSorting, completed]);

  const displayedArray = currentStep?.array || items;
  const metadata = ALGORITHM_DATA[algorithm];

  // Dynamic Highlighter Color: Prioritize active element's hex, fallback to theme primary
  // Dynamic Highlighter Color: Prioritize active element's hex, fallback to theme primary
  const themePrimary = ({
    GREEN: '#39FF14',
    FIRE: '#FF4500',
    OCEAN: '#00D4FF',
    RAINBOW: '#BD93F9',
    CYBERPUNK: '#00F0FF',
    SUNSET: '#FF5E36',
    NEON_TOXIC: '#39FF14',
    GOLDEN_HOUR: '#FFAA00',
    RETRO_WAVE: '#FF007F',
    EMERALD_MINT: '#00FFA3',
    AMETHYST: '#A855F7',
    PASTEL_CANDY: '#FF70A6',
    RANDOM: '#00F0FF'
  } as Record<string, string>)[theme] || '#00F0FF';

  const highlightColor = (currentStep && (currentStep.swappingIndices.length > 0 || currentStep.comparingIndices.length > 0))
    ? (currentStep.array[currentStep.swappingIndices[0] ?? currentStep.comparingIndices[0]].hex)
    : themePrimary;

  // Active comparing/swapping item hex for ambient lighting
  const activeColor = (currentStep && currentStep.swappingIndices.length > 0)
    ? currentStep.array[currentStep.swappingIndices[0]].hex
    : ((currentStep && currentStep.comparingIndices.length > 0)
      ? currentStep.array[currentStep.comparingIndices[0]].hex
      : highlightColor);

  return (
    <div className="h-screen w-full bg-[#030408] text-white overflow-hidden font-sans select-none relative flex flex-col items-center justify-between">
      {/* Dynamic Ambient Glow Backdrops */}
      <div 
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full filter blur-[150px] opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: activeColor }}
      />
      <div 
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full filter blur-[150px] opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: highlightColor }}
      />
      
      {/* Background Subtle Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="w-full h-full flex flex-col items-center justify-between px-16 pt-24 pb-20 relative z-10 box-border">

        {/* Top Header Section */}
        <header className="w-full max-w-5xl text-center z-40 relative">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 shadow-lg">
            <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: highlightColor }} />
            <span className="text-sm font-mono tracking-[0.25em] text-zinc-400 uppercase font-bold">COLOR GRADING VISUALIZER</span>
          </div>

          <h1 className="text-8xl font-black font-mono tracking-tight text-white mb-4 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] uppercase">
            {metadata.name}
          </h1>

          <p className="text-zinc-300 text-2xl font-medium italic mb-6 max-w-3xl mx-auto leading-relaxed text-balance">
            {metadata.description}
          </p>

          <div className="flex justify-center items-center gap-14 text-2xl font-mono uppercase font-black text-zinc-400">
            <div className="flex items-center gap-4 bg-zinc-900/80 px-6 py-2.5 rounded-2xl border border-white/10 shadow-lg">
              <span className="w-4 h-4 rounded-full shadow-[0_0_15px]" style={{ backgroundColor: highlightColor }} /> 
              <span>TIME: {metadata.timeComplexity}</span>
            </div>
            <div className="flex items-center gap-4 bg-zinc-900/80 px-6 py-2.5 rounded-2xl border border-white/10 shadow-lg">
              <span className="w-4 h-4 rounded-full opacity-60 shadow-[0_0_15px]" style={{ backgroundColor: highlightColor }} /> 
              <span>SPACE: {metadata.spaceComplexity}</span>
            </div>
          </div>
        </header>

        {/* HERO VISUALIZER: High Impact Color Spectrum Display */}
        <div className="w-full max-w-6xl h-[520px] my-4 flex items-end justify-center gap-3 px-6 pb-6 pt-12 relative bg-black/40 border border-white/10 rounded-[36px] backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Top Info Bar inside visualizer */}
          <div className="absolute top-4 left-6 flex items-center gap-3 px-4 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
            <span className={`w-2.5 h-2.5 rounded-full ${isSorting ? 'bg-amber-400 animate-pulse' : (completed ? 'bg-emerald-400' : 'bg-zinc-500')}`} />
            <span className="text-xs font-mono font-bold tracking-wider text-zinc-300">
              {isSorting ? 'CALIBRATING...' : (completed ? 'SPECTRUM GRADED 100%' : 'READY')}
            </span>
          </div>

          <div className="absolute top-4 right-6 text-xs font-mono tracking-widest text-zinc-400 font-bold uppercase bg-black/60 px-4 py-1 rounded-full border border-white/15">
            {theme} • {shape} • {soundMode}
          </div>

          {displayedArray.map((item, idx) => {
            const isComparing = currentStep?.comparingIndices.includes(idx);
            const isSwapping = currentStep?.swappingIndices.includes(idx);
            const isActive = isComparing || isSwapping;
            const barHeightPct = shape === 'BUBBLE' ? '100%' : (shape === 'WAVE' ? `${35 + Math.sin(item.value * Math.PI) * 65}%` : `${20 + item.value * 80}%`);

            let shapeClass = 'rounded-2xl';
            if (shape === 'BUBBLE') shapeClass = 'rounded-full aspect-square self-center';
            else if (shape === 'PILL') shapeClass = 'rounded-full';

            return (
              <div
                key={item.id}
                className={`flex-1 transition-all duration-100 relative ${shapeClass} ${completed ? 'ring-2 ring-white/50' : ''}`}
                style={{
                  height: shape === 'BUBBLE' ? undefined : barHeightPct,
                  backgroundColor: item.hex,
                  filter: isActive ? 'brightness(1.6) saturate(1.4)' : (completed ? 'brightness(1.1)' : 'brightness(0.95)'),
                  boxShadow: isActive ? `0 0 45px ${item.hex}, inset 0 0 20px rgba(255,255,255,0.6)` : (completed ? `0 0 15px ${item.hex}55` : `0 4px 15px rgba(0,0,0,0.4)`),
                  zIndex: isActive ? 30 : 2,
                  transform: isActive ? 'scale(1.15) translateY(-8px)' : 'scale(1)'
                }}
              >
                {/* Active Indicator Flare */}
                {isActive && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full animate-ping"
                    style={{ backgroundColor: item.hex }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* HIGH CONTRAST & CLEAR CODE TERMINAL */}
        <div className="w-full max-w-5xl bg-[#0b0f19] border-2 border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col mb-4 z-20 backdrop-blur-2xl">
          <div className="bg-[#131926] px-8 py-4 flex items-center justify-between border-b border-white/15">
            <div className="flex items-center gap-5">
              <div className="flex gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#FF5F56] shadow-md shadow-red-500/40" />
                <div className="w-4 h-4 rounded-full bg-[#FFBD2E] shadow-md shadow-yellow-500/40" />
                <div className="w-4 h-4 rounded-full bg-[#27C93F] shadow-md shadow-green-500/40" />
              </div>
              <span className="text-xl font-mono text-zinc-200 font-bold tracking-wider">
                {metadata.name.toLowerCase().replace(/\s+/g, '_')}.js
              </span>
            </div>
            <div className="px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono text-cyan-300 font-black tracking-widest uppercase">
              ALGORITHM SOURCE
            </div>
          </div>

          <div className="p-8 font-mono text-2xl leading-[1.7] text-white max-h-[380px] overflow-hidden bg-[#070a10]">
            {metadata.code.slice(0, 9).map((line, i) => {
              const isActive = currentStep?.currentLine === i + 1;
              return (
                <div
                  key={i}
                  className={`py-1.5 whitespace-pre flex gap-8 transition-all duration-150 rounded-xl px-4 ${isActive
                    ? 'border-l-4 scale-[1.02] origin-left z-30 font-extrabold bg-white/10'
                    : 'opacity-85'
                    }`}
                  style={{
                    borderLeftColor: isActive ? (highlightColor || '#00f0ff') : 'transparent',
                    boxShadow: isActive ? `0 0 30px ${highlightColor || '#00f0ff'}44` : 'none'
                  }}
                >
                  <span className={`select-none w-8 text-right font-bold ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                    {i + 1}
                  </span>
                  <span style={{ color: isActive ? '#ffffff' : '#e4e4e7', textShadow: isActive ? `0 0 10px ${highlightColor || '#00f0ff'}` : 'none' }}>
                    {line.split(/(function|const|let|var|for|if|while|return|break|true|false|null|=>)/).map((part, pi) => {
                      if (part === 'function' || part === 'const' || part === 'let' || part === 'var')
                        return <span key={pi} className="text-[#ff79c6] font-bold">{part}</span>;
                      if (part === 'for' || part === 'if' || part === 'while' || part === 'break' || part === 'return' || part === '=>')
                        return <span key={pi} className="text-[#bd93f9] font-bold">{part}</span>;
                      if (part === 'true' || part === 'false' || part === 'null')
                        return <span key={pi} className="text-[#50fa7b] font-bold">{part}</span>;
                      return <span key={pi} className="text-zinc-100">{part}</span>;
                    })}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-[#131926] py-3 text-center text-zinc-400 text-base font-mono font-bold tracking-[0.3em] uppercase border-t border-white/15">
            COLOR GRADING // VISUALIZED BY KREGGSCODE
          </div>
        </div>

        {/* Start Button (Visible only when idle) */}
        {!isSorting && !completed && (
          <button
            onClick={startSorting}
            className="bg-white text-black text-2xl font-black px-12 py-4 rounded-full uppercase tracking-widest hover:scale-105 transition-all z-50 shadow-[0_0_50px_rgba(255,255,255,0.4)]"
          >
            Grade Palette
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
