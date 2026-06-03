
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
  },
  GNOME: {
    name: 'Gnome Sort',
    description: 'A simple sorting algorithm that works by repeatedly swapping adjacent elements if they are in the wrong order, similar to insertion sort.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: [
      "function gnomeSort(arr) {",
      "  let pos = 0;",
      "  while (pos < arr.length) {",
      "    if (pos === 0 || arr[pos] >= arr[pos-1]) pos++;",
      "    else { swap(arr, pos, pos-1); pos--; }",
      "  }",
      "}"
    ]
  },
  SHELL: {
    name: 'Shell Sort',
    description: 'A generalization of insertion sort that allows the exchange of far-apart elements, using decreasing gaps to sort more efficiently.',
    timeComplexity: 'O(n log² n)',
    spaceComplexity: 'O(1)',
    code: [
      "function shellSort(arr) {",
      "  for (let gap = n/2; gap > 0; gap /= 2) {",
      "    for (let i = gap; i < n; i++) {",
      "      let temp = arr[i], j = i;",
      "      while (j >= gap && arr[j-gap] > temp) {",
      "        arr[j] = arr[j-gap]; j -= gap;",
      "      }",
      "      arr[j] = temp;",
      "    }",
      "  }",
      "}"
    ]
  },
  COMB: {
    name: 'Comb Sort',
    description: 'An improved bubble sort that eliminates turtles by comparing elements with a decreasing gap, starting wide and narrowing.',
    timeComplexity: 'O(n²/2^p)',
    spaceComplexity: 'O(1)',
    code: [
      "function combSort(arr) {",
      "  let gap = arr.length;",
      "  let swapped = true;",
      "  while (gap > 1 || swapped) {",
      "    gap = max(1, floor(gap / 1.3));",
      "    swapped = false;",
      "    for (let i = 0; i + gap < n; i++) {",
      "      if (arr[i] > arr[i+gap]) {",
      "        swap(arr, i, i+gap); swapped = true;",
      "      }",
      "    }",
      "  }",
      "}"
    ]
  },
  CYCLE: {
    name: 'Cycle Sort',
    description: 'An in-place sorting algorithm that minimizes memory writes by rotating cycles of misplaced elements.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: [
      "function cycleSort(arr) {",
      "  for (let start = 0; start < n-1; start++) {",
      "    let item = arr[start], pos = start;",
      "    for (let i = start+1; i < n; i++)",
      "      if (arr[i] < item) pos++;",
      "    if (pos === start) continue;",
      "    swap(item, arr[pos]);",
      "    while (pos !== start) {",
      "      pos = start;",
      "      for (let i = start+1; i < n; i++)",
      "        if (arr[i] < item) pos++;",
      "      swap(item, arr[pos]);",
      "    }",
      "  }",
      "}"
    ]
  },
  ODDEVEN: {
    name: 'Odd-Even Sort',
    description: 'A parallel-friendly sorting algorithm that alternates comparing odd-indexed and even-indexed adjacent pairs.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: [
      "function oddEvenSort(arr) {",
      "  let sorted = false;",
      "  while (!sorted) {",
      "    sorted = true;",
      "    for (let i = 1; i < n-1; i += 2)",
      "      if (arr[i] > arr[i+1]) { swap(arr, i, i+1); sorted = false; }",
      "    for (let i = 0; i < n-1; i += 2)",
      "      if (arr[i] > arr[i+1]) { swap(arr, i, i+1); sorted = false; }",
      "  }",
      "}"
    ]
  },
  PANCAKE: {
    name: 'Pancake Sort',
    description: 'A sorting algorithm that uses only prefix reversals (flips), like flipping a stack of pancakes to the correct order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: [
      "function pancakeSort(arr) {",
      "  for (let n = arr.length; n > 1; n--) {",
      "    let max = 0;",
      "    for (let i = 1; i < n; i++)",
      "      if (arr[i] > arr[max]) max = i;",
      "    if (max !== n-1) {",
      "      flip(arr, 0, max);",
      "      flip(arr, 0, n-1);",
      "    }",
      "  }",
      "}"
    ]
  },
  STOOGE: {
    name: 'Stooge Sort',
    description: 'A notoriously inefficient recursive sorting algorithm that sorts the first 2/3, last 2/3, then first 2/3 again.',
    timeComplexity: 'O(n^2.7)',
    spaceComplexity: 'O(n)',
    code: [
      "function stoogeSort(arr, l, r) {",
      "  if (arr[l] > arr[r]) swap(arr, l, r);",
      "  if (r - l + 1 > 2) {",
      "    let t = floor((r - l + 1) / 3);",
      "    stoogeSort(arr, l, r - t);",
      "    stoogeSort(arr, l + t, r);",
      "    stoogeSort(arr, l, r - t);",
      "  }",
      "}"
    ]
  },
  RADIX: {
    name: 'Radix Sort',
    description: 'A non-comparative integer sort that processes digits individually, grouping elements by each digit position.',
    timeComplexity: 'O(nk)',
    spaceComplexity: 'O(n+k)',
    code: [
      "function radixSort(arr) {",
      "  const max = maxValue(arr);",
      "  for (let digit = 0; digit < digits(max); digit++) {",
      "    const buckets = Array.from({length: 10}, () => []);",
      "    for (const x of arr)",
      "      buckets[digitAt(x, digit)].push(x);",
      "    arr = [].concat(...buckets);",
      "  }",
      "}"
    ]
  },
  TIM: {
    name: 'Tim Sort',
    description: 'A hybrid stable sorting algorithm derived from merge sort and insertion sort, used in Python and Java standard libraries.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    code: [
      "function timSort(arr) {",
      "  const RUN = 32;",
      "  for (let i = 0; i < n; i += RUN)",
      "    insertionSort(arr, i, min(i+RUN-1, n-1));",
      "  for (let s = RUN; s < n; s *= 2) {",
      "    for (let l = 0; l < n; l += 2*s) {",
      "      const m = l + s - 1, r = min(l + 2*s - 1, n-1);",
      "      if (m < r) merge(arr, l, m, r);",
      "    }",
      "  }",
      "}"
    ]
  },
  BOGO: {
    name: 'Bogo Sort',
    description: 'A highly inefficient sorting algorithm that repeatedly shuffles the array until it happens to be sorted by chance.',
    timeComplexity: 'O((n+1)!)',
    spaceComplexity: 'O(1)',
    code: [
      "function bogoSort(arr) {",
      "  while (!isSorted(arr)) {",
      "    shuffle(arr);",
      "  }",
      "}"
    ]
  }
};
