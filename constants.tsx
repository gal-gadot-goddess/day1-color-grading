
import { AlgorithmType, AlgorithmMetadata } from './types';

export const ALGORITHM_DATA: Record<AlgorithmType, AlgorithmMetadata & { description: string }> = {
  BUBBLE: {
    name: 'Bubble Sort',
    description: 'A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: [
      "function bubbleSort(arr) {",
      "  for (let i = 0; i < arr.length; i++) {",
      "    let swapped = false;",
      "    for (let j = 0; j < arr.length - i - 1; j++) {",
      "      if (arr[j].val > arr[j+1].val) {",
      "        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];",
      "        swapped = true;",
      "      }",
      "    }",
      "    if (!swapped) break;",
      "  }",
      "}"
    ]
  },
  INSERTION: {
    name: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: [
      "function insertionSort(arr) {",
      "  for (let i = 1; i < arr.length; i++) {",
      "    let key = arr[i], j = i - 1;",
      "    while (j >= 0 && arr[j].val > key.val) {",
      "      arr[j + 1] = arr[j];",
      "      j--;",
      "    }",
      "    arr[j + 1] = key;",
      "  }",
      "}"
    ]
  },
  SELECTION: {
    name: 'Selection Sort',
    description: 'In-place comparison sorting algorithm. It has an O(n²) time complexity, which makes it inefficient on large lists, and generally performs worse than insertion sort.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: [
      "function selectionSort(arr) {",
      "  for (let i = 0; i < arr.length; i++) {",
      "    let min = i;",
      "    for (let j = i + 1; j < arr.length; j++) {",
      "      if (arr[j].val < arr[min].val) min = j;",
      "    }",
      "    [arr[i], arr[min]] = [arr[min], arr[i]];",
      "  }",
      "}"
    ]
  },
  QUICK: {
    name: 'Quick Sort',
    description: 'A divide-and-conquer algorithm. It works by selecting a "pivot" element and partitioning the other elements into two sub-arrays.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    code: [
      "function quickSort(arr, low, high) {",
      "  if (low < high) {",
      "    let pi = partition(arr, low, high);",
      "    quickSort(arr, low, pi - 1);",
      "    quickSort(arr, pi + 1, high);",
      "  }",
      "}"
    ]
  },
  MERGE: {
    name: 'Merge Sort',
    description: 'An efficient, general-purpose, and comparison-based sorting algorithm. Most implementations produce a stable sort.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    code: [
      "function mergeSort(arr, l, r) {",
      "  if (l < r) {",
      "    let m = Math.floor((l + r) / 2);",
      "    mergeSort(arr, l, m);",
      "    mergeSort(arr, m + 1, r);",
      "    merge(arr, l, m, r);",
      "  }",
      "}"
    ]
  },
  HEAP: {
    name: 'Heap Sort',
    description: 'A comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    code: [
      "function heapSort(arr) {",
      "  let n = arr.length;",
      "  for (let i = Math.floor(n/2) - 1; i >= 0; i--)",
      "    heapify(arr, n, i);",
      "  for (let i = n - 1; i > 0; i--) {",
      "    [arr[0], arr[i]] = [arr[i], arr[0]];",
      "    heapify(arr, i, 0);",
      "  }",
      "}"
    ]
  },
  COCKTAIL: {
    name: 'Cocktail Sort',
    description: 'Also known as bidirectional bubble sort. It sorts in both directions each pass through the list, making it slightly faster than bubble sort.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: [
      "function cocktailSort(arr) {",
      "  let swapped = true, start = 0, end = arr.length;",
      "  while (swapped) {",
      "    swapped = false;",
      "    for (let i = start; i < end - 1; ++i) {",
      "      if (arr[i] > arr[i + 1]) {",
      "        swap(arr, i, i + 1); swapped = true;",
      "      }",
      "    }",
      "    if (!swapped) break;",
      "    swapped = false; end--;",
      "    for (let i = end - 1; i >= start; i--) {",
      "      if (arr[i] > arr[i + 1]) {",
      "        swap(arr, i, i + 1); swapped = true;",
      "      }",
      "    }",
      "    start++;",
      "  }",
      "}"
    ]
  }
};
