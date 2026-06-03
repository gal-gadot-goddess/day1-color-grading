
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
    return (t && ['GREEN', 'RAINBOW', 'FIRE', 'OCEAN', 'RANDOM'].includes(t)) ? (t as ColorTheme) : 'GREEN';
  });
  const [shape, setShape] = useState<VisualShape>(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('shape');
    return (s && ['BAR', 'BUBBLE'].includes(s)) ? (s as VisualShape) : 'BAR';
  });

  const [hideUI, setHideUI] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('hideUI') === 'true';
  });

  const [isAutoLoop, setIsAutoLoop] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('auto') === 'true';
  });

  const [items, setItems] = useState<ColorItem[]>([]);
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
  const themePrimary = ({
    GREEN: '#39FF14',
    FIRE: '#FF3300',
    OCEAN: '#00D4FF',
    RAINBOW: '#BD93F9',
    RANDOM: '#BD93F9'
  } as Record<string, string>)[theme];

  const highlightColor = (currentStep && (currentStep.swappingIndices.length > 0 || currentStep.comparingIndices.length > 0))
    ? (currentStep.array[currentStep.swappingIndices[0] ?? currentStep.comparingIndices[0]].hex)
    : themePrimary;

  return (
    <div className="h-screen w-full bg-[#050505] text-white overflow-hidden font-sans select-none relative">
      <div className="w-full h-full flex flex-col items-center justify-between p-[12%] py-[15%] relative">

        {/* Branding Watermark */}
        <div className="absolute top-8 right-8 text-zinc-800 text-3xl font-black uppercase tracking-widest opacity-30 pointer-events-none rotate-90 origin-top-right">
          kreggscode
        </div>

        {/* Persistent Header Section */}
        <header className="w-full max-w-5xl mt-8 text-center z-40 relative">
          <h1 className="text-7xl font-black mono tracking-tighter text-white mb-4 drop-shadow-2xl">
            {metadata.name}
          </h1>
          <p className="text-zinc-400 text-2xl font-medium italic mb-8 max-w-3xl mx-auto leading-relaxed">
            {metadata.description}
          </p>
          <div className="flex justify-center items-center gap-16 text-2xl mono uppercase font-black text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: highlightColor }}></span> {metadata.timeComplexity}
            </div>
            <div className="flex items-center gap-4">
              <span className="w-4 h-4 rounded-full opacity-60" style={{ backgroundColor: highlightColor }}></span> {metadata.spaceComplexity}
            </div>
          </div>
        </header>

        {/* Visualizer Area - Enlarged */}
        <div className="w-full max-w-6xl flex-grow flex items-stretch justify-center gap-2 my-8 px-4 relative">
          {displayedArray.map((item, idx) => {
            const isComparing = currentStep?.comparingIndices.includes(idx);
            const isSwapping = currentStep?.swappingIndices.includes(idx);
            return (
              <div
                key={item.id}
                className={`flex-1 transition-all duration-75 ${shape === 'BUBBLE' ? 'rounded-full scale-90' : 'rounded-lg'} ${completed ? 'ring-4 ring-emerald-500/30' : ''}`}
                style={{
                  backgroundColor: item.hex,
                  filter: (isComparing || isSwapping) ? 'brightness(1.5) saturate(1.2)' : 'none',
                  boxShadow: (isComparing || isSwapping) ? `0 0 40px ${item.hex}` : 'none',
                  zIndex: (isComparing || isSwapping) ? 10 : 1,
                  transform: (isComparing || isSwapping) ? 'scaleY(1.05) scaleX(1.1)' : (shape === 'BUBBLE' ? 'scale(0.95)' : 'none')
                }}
              />
            );
          })}

          {/* Sorting Overlay Status when UI hidden */}
          {isSorting && hideUI && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-2xl font-black tracking-widest text-white/20 animate-pulse">
              SORTING...
            </div>
          )}
        </div>

        {/* Code Terminal - Massive and High Detail */}
        <div className="w-full max-w-5xl bg-[#080808] border border-zinc-800/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col mb-12 z-20 transition-all duration-500 group">
          <div className="bg-[#121212] px-10 py-6 flex items-center gap-6 border-b border-zinc-800/50">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[#FF5F56] shadow-lg shadow-red-500/20" />
              <div className="w-6 h-6 rounded-full bg-[#FFBD2E] shadow-lg shadow-yellow-500/20" />
              <div className="w-6 h-6 rounded-full bg-[#27C93F] shadow-lg shadow-green-500/20" />
            </div>
            <div className="ml-auto text-2xl mono text-zinc-600 font-black tracking-widest uppercase">
              kreggscode.js
            </div>
          </div>

          <div className="p-12 font-mono text-3xl leading-[1.7] text-white min-h-[550px] overflow-hidden bg-black/40 backdrop-blur-md">
            {metadata.code.map((line, i) => {
              const isActive = currentStep?.currentLine === i + 1;
              return (
                <div
                  key={i}
                  className={`py-2 whitespace-pre flex gap-16 transition-all duration-300 ${isActive
                    ? '-mx-16 px-16 border-l-[24px] scale-[1.08] origin-left z-30'
                    : 'opacity-40'
                    }`}
                  style={{
                    backgroundColor: isActive ? `color-mix(in srgb, ${highlightColor}, transparent 85%)` : 'transparent',
                    borderLeftColor: isActive ? highlightColor : 'transparent',
                    boxShadow: isActive ? `0 0 60px color-mix(in srgb, ${highlightColor}, transparent 80%)` : 'none'
                  }}
                >
                  <span className={`select-none w-12 text-right font-black transition-all ${isActive ? 'scale-125' : 'text-zinc-800'}`} style={{ color: isActive ? highlightColor : undefined, textShadow: isActive ? `0 0 20px ${highlightColor}` : 'none' }}>{i + 1}</span>
                  <span className={`tracking-tight font-black`} style={{ color: isActive ? '#fff' : undefined, textShadow: isActive ? `0 0 15px ${highlightColor}` : 'none' }}>
                    {line.split(/(function|const|let|var|for|if|while|return|break|true|false|null|=>)/).map((part, pi) => {
                      if (part === 'function' || part === 'const' || part === 'let' || part === 'var')
                        return <span key={pi} className="text-[#ff79c6] font-black">{part}</span>; // Pink
                      if (part === 'for' || part === 'if' || part === 'while' || part === 'break' || part === 'return' || part === '=>')
                        return <span key={pi} className="text-[#bd93f9] font-black">{part}</span>; // Purple
                      if (part === 'true' || part === 'false' || part === 'null')
                        return <span key={pi} className="text-[#ffb86c] font-black">{part}</span>; // Orange
                      return <span key={pi} className="text-white">{part}</span>;
                    })}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Footer branding in terminal */}
          <div className="bg-[#121212] py-4 text-center text-zinc-700 text-lg font-black tracking-[0.4em] uppercase border-t border-zinc-800/50">
            ALGORITHM VISUALIZATION // @kreggscode
          </div>
        </div>

        {/* Hidden Controls - For initial trigger and debugging */}
        {!isSorting && !completed && (
          <button
            onClick={startSorting}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black text-2xl font-black px-12 py-4 rounded-full uppercase tracking-widest hover:bg-emerald-400 transition-all z-50 shadow-2xl"
          >
            Begin Experience
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
