
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
