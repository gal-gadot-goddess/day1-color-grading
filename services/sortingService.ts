
import { ColorItem, SortStep } from '../types';

export function* bubbleSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  const n = arr.length;
  yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 2 };
  for (let i = 0; i < n - 1; i++) {
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 3 };
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...arr], comparingIndices: [j, j + 1], swappingIndices: [], activeIndices: [], currentLine: 5 };
      if (arr[j].value > arr[j + 1].value) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { array: [...arr], comparingIndices: [], swappingIndices: [j, j + 1], activeIndices: [], currentLine: 6 };
        swapped = true;
        yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 7 };
      }
    }
    if (!swapped) {
      yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 10 };
      break;
    }
  }
}

export function* insertionSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  for (let i = 1; i < arr.length; i++) {
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [i], currentLine: 2 };
    let key = arr[i];
    let j = i - 1;
    yield { array: [...arr], comparingIndices: [j], swappingIndices: [], activeIndices: [i], currentLine: 3 };
    while (j >= 0 && arr[j].value > key.value) {
      yield { array: [...arr], comparingIndices: [j], swappingIndices: [], activeIndices: [i], currentLine: 4 };
      arr[j + 1] = arr[j];
      yield { array: [...arr], comparingIndices: [], swappingIndices: [j, j + 1], activeIndices: [i], currentLine: 5 };
      j = j - 1;
      yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [i], currentLine: 6 };
    }
    arr[j + 1] = key;
    yield { array: [...arr], comparingIndices: [], swappingIndices: [j + 1], activeIndices: [], currentLine: 8 };
  }
}

export function* selectionSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  for (let i = 0; i < arr.length; i++) {
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [i], currentLine: 2 };
    let minIdx = i;
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [i], currentLine: 3 };
    for (let j = i + 1; j < arr.length; j++) {
      yield { array: [...arr], comparingIndices: [j, minIdx], swappingIndices: [], activeIndices: [i], currentLine: 4 };
      if (arr[j].value < arr[minIdx].value) {
        minIdx = j;
        yield { array: [...arr], comparingIndices: [minIdx], swappingIndices: [], activeIndices: [i], currentLine: 5 };
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    yield { array: [...arr], comparingIndices: [], swappingIndices: [i, minIdx], activeIndices: [], currentLine: 7 };
  }
}

export function* quickSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  yield* quickSortHelper(arr, 0, arr.length - 1);
}

function* quickSortHelper(arr: ColorItem[], low: number, high: number): Generator<SortStep> {
  if (low < high) {
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 2 };

    // Inline partition for better line tracking
    const pivotValue = arr[high].value;
    yield { array: [...arr], comparingIndices: [high], swappingIndices: [], activeIndices: [], currentLine: 3 }; // partition
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { array: [...arr], comparingIndices: [j, high], swappingIndices: [], activeIndices: [], currentLine: 3 };
      if (arr[j].value < pivotValue) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { array: [...arr], comparingIndices: [], swappingIndices: [i, j], activeIndices: [], currentLine: 3 };
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield { array: [...arr], comparingIndices: [], swappingIndices: [i + 1, high], activeIndices: [], currentLine: 3 };
    const pi = i + 1;

    yield* quickSortHelper(arr, low, pi - 1);
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 4 };
    yield* quickSortHelper(arr, pi + 1, high);
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 5 };
  }
}

export function* mergeSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  yield* mergeSortHelper(arr, 0, arr.length - 1);
}

function* mergeSortHelper(arr: ColorItem[], l: number, r: number): Generator<SortStep> {
  if (l < r) {
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 2 };
    const m = Math.floor((l + r) / 2);
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 3 };
    yield* mergeSortHelper(arr, l, m);
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 4 };
    yield* mergeSortHelper(arr, m + 1, r);
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 5 };
    yield* merge(arr, l, m, r);
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 6 };
  }
}

function* merge(arr: ColorItem[], l: number, m: number, r: number): Generator<SortStep> {
  const n1 = m - l + 1;
  const n2 = r - m;
  const L = arr.slice(l, m + 1);
  const R = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    yield { array: [...arr], comparingIndices: [k], swappingIndices: [], activeIndices: [], currentLine: 6 };
    if (L[i].value <= R[j].value) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    yield { array: [...arr], comparingIndices: [], swappingIndices: [k], activeIndices: [], currentLine: 6 };
    k++;
  }
  while (i < n1) {
    arr[k] = L[i];
    yield { array: [...arr], comparingIndices: [], swappingIndices: [k], activeIndices: [], currentLine: 6 };
    i++; k++;
  }
  while (j < n2) {
    arr[k] = R[j];
    yield { array: [...arr], comparingIndices: [], swappingIndices: [k], activeIndices: [], currentLine: 6 };
    j++; k++;
  }
}

export function* heapSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  const n = arr.length;
  yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 2 };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 3 };
    yield* heapify(arr, n, i, 4);
  }

  for (let i = n - 1; i > 0; i--) {
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 5 };
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield { array: [...arr], comparingIndices: [], swappingIndices: [0, i], activeIndices: [], currentLine: 6 };
    yield* heapify(arr, i, 0, 7);
  }
}

function* heapify(arr: ColorItem[], n: number, i: number, lineOverride: number): Generator<SortStep> {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  yield { array: [...arr], comparingIndices: [l, r, largest].filter(idx => idx < n), swappingIndices: [], activeIndices: [], currentLine: lineOverride };

  if (l < n && arr[l].value > arr[largest].value) {
    largest = l;
  }
  if (r < n && arr[r].value > arr[largest].value) {
    largest = r;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield { array: [...arr], comparingIndices: [], swappingIndices: [i, largest], activeIndices: [], currentLine: lineOverride };
    yield* heapify(arr, n, largest, lineOverride);
  }
}

export function* cocktailShakerSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  let swapped = true;
  let start = 0;
  let end = arr.length;
  yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 2 };

  while (swapped) {
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 3 };
    swapped = false;
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 4 };
    for (let i = start; i < end - 1; ++i) {
      yield { array: [...arr], comparingIndices: [i, i + 1], swappingIndices: [], activeIndices: [], currentLine: 5 };
      if (arr[i].value > arr[i + 1].value) {
        yield { array: [...arr], comparingIndices: [i, i + 1], swappingIndices: [], activeIndices: [], currentLine: 6 };
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        yield { array: [...arr], comparingIndices: [], swappingIndices: [i, i + 1], activeIndices: [], currentLine: 7 };
      }
    }

    if (!swapped) {
      yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 10 };
      break;
    }
    swapped = false;
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 11 };
    end--;

    for (let i = end - 1; i >= start; i--) {
      yield { array: [...arr], comparingIndices: [i, i + 1], swappingIndices: [], activeIndices: [], currentLine: 12 };
      if (arr[i].value > arr[i + 1].value) {
        yield { array: [...arr], comparingIndices: [i, i + 1], swappingIndices: [], activeIndices: [], currentLine: 13 };
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        yield { array: [...arr], comparingIndices: [], swappingIndices: [i, i + 1], activeIndices: [], currentLine: 14 };
      }
    }
    start++;
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 17 };
  }
}

export function* gnomeSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  let pos = 0;
  while (pos < arr.length) {
    yield { array: [...arr], comparingIndices: [pos], swappingIndices: [], activeIndices: [], currentLine: 2 };
    if (pos === 0 || arr[pos].value >= arr[pos - 1].value) {
      pos++;
    } else {
      [arr[pos], arr[pos - 1]] = [arr[pos - 1], arr[pos]];
      yield { array: [...arr], comparingIndices: [], swappingIndices: [pos, pos - 1], activeIndices: [], currentLine: 4 };
      pos--;
    }
  }
}

export function* shellSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  let gap = Math.floor(arr.length / 2);
  while (gap > 0) {
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 2 };
    for (let i = gap; i < arr.length; i++) {
      let temp = arr[i];
      let j = i;
      yield { array: [...arr], comparingIndices: [j], swappingIndices: [], activeIndices: [], currentLine: 3 };
      while (j >= gap && arr[j - gap].value > temp.value) {
        arr[j] = arr[j - gap];
        yield { array: [...arr], comparingIndices: [], swappingIndices: [j, j - gap], activeIndices: [], currentLine: 5 };
        j -= gap;
      }
      arr[j] = temp;
      yield { array: [...arr], comparingIndices: [], swappingIndices: [j], activeIndices: [], currentLine: 7 };
    }
    gap = Math.floor(gap / 2);
  }
}

export function* combSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  let gap = arr.length;
  let swapped = true;
  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / 1.3));
    swapped = false;
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 2 };
    for (let i = 0; i + gap < arr.length; i++) {
      yield { array: [...arr], comparingIndices: [i, i + gap], swappingIndices: [], activeIndices: [], currentLine: 3 };
      if (arr[i].value > arr[i + gap].value) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        yield { array: [...arr], comparingIndices: [], swappingIndices: [i, i + gap], activeIndices: [], currentLine: 4 };
        swapped = true;
      }
    }
  }
}

export function* cycleSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  for (let cycleStart = 0; cycleStart < arr.length - 1; cycleStart++) {
    let item = arr[cycleStart];
    let pos = cycleStart;
    yield { array: [...arr], comparingIndices: [cycleStart], swappingIndices: [], activeIndices: [], currentLine: 2 };
    for (let i = cycleStart + 1; i < arr.length; i++) {
      if (arr[i].value < item.value) pos++;
    }
    if (pos === cycleStart) continue;
    while (item.value === arr[pos].value) pos++;
    if (pos !== cycleStart) {
      [item, arr[pos]] = [arr[pos], item];
      yield { array: [...arr], comparingIndices: [], swappingIndices: [cycleStart, pos], activeIndices: [], currentLine: 7 };
    }
    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < arr.length; i++) {
        if (arr[i].value < item.value) pos++;
      }
      while (item.value === arr[pos].value) pos++;
      if (item.value !== arr[pos].value) {
        [item, arr[pos]] = [arr[pos], item];
        yield { array: [...arr], comparingIndices: [], swappingIndices: [cycleStart, pos], activeIndices: [], currentLine: 12 };
      }
    }
  }
}

export function* oddEvenSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < arr.length - 1; i += 2) {
      yield { array: [...arr], comparingIndices: [i, i + 1], swappingIndices: [], activeIndices: [], currentLine: 3 };
      if (arr[i].value > arr[i + 1].value) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        yield { array: [...arr], comparingIndices: [], swappingIndices: [i, i + 1], activeIndices: [], currentLine: 4 };
      }
    }
    for (let i = 0; i < arr.length - 1; i += 2) {
      yield { array: [...arr], comparingIndices: [i, i + 1], swappingIndices: [], activeIndices: [], currentLine: 7 };
      if (arr[i].value > arr[i + 1].value) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        yield { array: [...arr], comparingIndices: [], swappingIndices: [i, i + 1], activeIndices: [], currentLine: 8 };
      }
    }
  }
}

export function* pancakeSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  for (let n = arr.length; n > 1; n--) {
    let maxIdx = 0;
    for (let i = 1; i < n; i++) {
      yield { array: [...arr], comparingIndices: [i, maxIdx], swappingIndices: [], activeIndices: [], currentLine: 3 };
      if (arr[i].value > arr[maxIdx].value) maxIdx = i;
    }
    if (maxIdx !== n - 1) {
      let l = 0, r = maxIdx;
      while (l < r) {
        [arr[l], arr[r]] = [arr[r], arr[l]];
        yield { array: [...arr], comparingIndices: [], swappingIndices: [l, r], activeIndices: [], currentLine: 6 };
        l++; r--;
      }
      l = 0; r = n - 1;
      while (l < r) {
        [arr[l], arr[r]] = [arr[r], arr[l]];
        yield { array: [...arr], comparingIndices: [], swappingIndices: [l, r], activeIndices: [], currentLine: 9 };
        l++; r--;
      }
    }
  }
}

export function* stoogeSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  yield* stoogeSortHelper(arr, 0, arr.length - 1);
}

function* stoogeSortHelper(arr: ColorItem[], l: number, r: number): Generator<SortStep> {
  yield { array: [...arr], comparingIndices: [l, r], swappingIndices: [], activeIndices: [], currentLine: 2 };
  if (arr[l].value > arr[r].value) {
    [arr[l], arr[r]] = [arr[r], arr[l]];
    yield { array: [...arr], comparingIndices: [], swappingIndices: [l, r], activeIndices: [], currentLine: 3 };
  }
  if (r - l + 1 > 2) {
    const t = Math.floor((r - l + 1) / 3);
    yield* stoogeSortHelper(arr, l, r - t);
    yield* stoogeSortHelper(arr, l + t, r);
    yield* stoogeSortHelper(arr, l, r - t);
  }
}

export function* radixSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  const max = Math.max(...arr.map(x => x.value));
  const maxDigits = Math.floor(Math.log10(max)) + 1;
  for (let digit = 0; digit < maxDigits; digit++) {
    const buckets: ColorItem[][] = Array.from({ length: 10 }, () => []);
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 2 };
    for (let i = 0; i < arr.length; i++) {
      const bucketIdx = Math.floor(arr[i].value / Math.pow(10, digit)) % 10;
      buckets[bucketIdx].push(arr[i]);
      yield { array: [...arr], comparingIndices: [i], swappingIndices: [], activeIndices: [], currentLine: 3 };
    }
    let idx = 0;
    for (const bucket of buckets) {
      for (const item of bucket) {
        arr[idx] = item;
        yield { array: [...arr], comparingIndices: [], swappingIndices: [idx], activeIndices: [], currentLine: 6 };
        idx++;
      }
    }
  }
}

export function* timSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  const RUN = 32;
  for (let i = 0; i < arr.length; i += RUN) {
    const end = Math.min(i + RUN - 1, arr.length - 1);
    for (let j = i + 1; j <= end; j++) {
      let key = arr[j];
      let k = j - 1;
      yield { array: [...arr], comparingIndices: [k, j], swappingIndices: [], activeIndices: [], currentLine: 3 };
      while (k >= i && arr[k].value > key.value) {
        arr[k + 1] = arr[k];
        yield { array: [...arr], comparingIndices: [], swappingIndices: [k, k + 1], activeIndices: [], currentLine: 5 };
        k--;
      }
      arr[k + 1] = key;
    }
  }
  for (let size = RUN; size < arr.length; size *= 2) {
    for (let left = 0; left < arr.length; left += 2 * size) {
      const mid = Math.min(left + size - 1, arr.length - 1);
      const right = Math.min(left + 2 * size - 1, arr.length - 1);
      if (mid < right) {
        yield* timMerge(arr, left, mid, right);
      }
    }
  }
}

function* timMerge(arr: ColorItem[], l: number, m: number, r: number): Generator<SortStep> {
  const L = arr.slice(l, m + 1);
  const R = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < L.length && j < R.length) {
    yield { array: [...arr], comparingIndices: [k], swappingIndices: [], activeIndices: [], currentLine: 3 };
    if (L[i].value <= R[j].value) {
      arr[k] = L[i]; i++;
    } else {
      arr[k] = R[j]; j++;
    }
    yield { array: [...arr], comparingIndices: [], swappingIndices: [k], activeIndices: [], currentLine: 4 };
    k++;
  }
  while (i < L.length) { arr[k] = L[i]; i++; k++; }
  while (j < R.length) { arr[k] = R[j]; j++; k++; }
}

export function* bogoSort(array: ColorItem[]): Generator<SortStep> {
  const arr = [...array];
  function isSorted(a: ColorItem[]): boolean {
    for (let i = 1; i < a.length; i++) {
      if (a[i - 1].value > a[i].value) return false;
    }
    return true;
  }
  while (!isSorted(arr)) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 2 };
  }
  yield { array: [...arr], comparingIndices: [], swappingIndices: [], activeIndices: [], currentLine: 4 };
}
