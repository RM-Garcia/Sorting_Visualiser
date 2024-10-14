// Global Variables and DOM Elements
const arrayContainer = document.getElementById('array-container');
const sortingSpeedLabel = document.getElementById('sorting-speed-label');
const sortButton = document.querySelector('button[onclick="sortArray()"]');

let array = [];
let sorting = false;
let delay = 150; // Default sorting speed (milliseconds)
let arraySize = 50; // Default array size

// -----------------------------------------
// Array Generation and Rendering Functions
// -----------------------------------------

// Function to generate a new array based on the array size slider
function generateArray() {
    array = [];
    sorting = false;
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    renderArray();
}

// Function to render the array as visual bars
function renderArray() {
    arrayContainer.innerHTML = '';  // Clear previous bars
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${array[i] * 2}px`; // Scale height of bars
        arrayContainer.appendChild(bar);
    }
}

// Update the array size when the slider is changed
function updateArraySize(size) {
    arraySize = size;
    generateArray();
}

// Update the sorting speed when the slider is changed
function updateSortingSpeed(speed) {
    // Map the speed (1-10) to a delay value between 200ms and 100ms
    delay = 200 - (speed * 10);  // At speed 1, delay = 200ms, at speed 9, delay = 110ms
    sortingSpeedLabel.textContent = speed;
}

// -----------------------------------------
// Sorting Algorithm Functions
// -----------------------------------------

// General function to perform sorting based on the selected algorithm
async function sortArray() {
    sortButton.disabled = true;
    const selectedAlgorithm = document.getElementById('sorting-algorithms').value;
    sorting = true;

    switch (selectedAlgorithm) {
        case 'bubbleSort':
            await bubbleSort();
            break;
        case 'selectionSort':
            await selectionSort();
            break;
        case 'insertionSort':
            await insertionSort();
            break;
        case 'quickSort':
            await quickSort(array, 0, array.length - 1);
            break;
        case 'mergeSort':
            await mergeSort(array, 0, array.length - 1);
            break;
        case 'heapSort':
            await heapSort();
            break;
        case 'radixSort':
            await radixSort();
            break;
        case 'shellSort':
            await shellSort();
            break;
        default:
            break;
    }

    sorting = false;
    sortButton.disabled = false;
}

// Bubble Sort Algorithm
async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!sorting) return;

            highlightBars(j, j + 1);
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
            removeHighlightBars(j, j + 1);
        }
        document.getElementsByClassName('bar')[array.length - i - 1].classList.add('sorted');
    }
}

// Selection Sort Algorithm
async function selectionSort() {
    for (let i = 0; i < array.length - 1; i++) {
        if (!sorting) return;
        let minIndex = i;
        highlightBars(i, minIndex);
        for (let j = i + 1; j < array.length; j++) {
            if (!sorting) return;
            highlightBars(j, minIndex);
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            removeHighlightBars(j, minIndex);
        }
        await swap(i, minIndex);
        document.getElementsByClassName('bar')[i].classList.add('sorted');
    }
}

// Insertion Sort Algorithm
async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i]; // Current value to be inserted
        let j = i - 1;

        highlightBars(i, j); // Highlight current element being checked
        await new Promise(resolve => setTimeout(resolve, delay)); // Optional delay for visibility
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j]; // Shift elements to the right
            updateBarHeight(j + 1); // Update bar height without using swap
            if (!sorting) return;
            j--;
            await new Promise(resolve => setTimeout(resolve, delay)); // Delay for animation
        }
        array[j + 1] = key; // Insert key in its correct position
        updateBarHeight(j + 1); // Update the bar height for the inserted key
        document.getElementsByClassName('bar')[j + 1].classList.add('sorted'); // Mark as sorted

        // Reset highlights
        removeHighlightBars(i, j + 1); // Reset highlight
    }
}

// Quick Sort Algorithm
async function quickSort(arr, low, high) {
    if (!sorting) return;
    if (low < high) {
        let pi = await partition(arr, low, high);
        if (!sorting) return;
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (!sorting) return;
        highlightBars(j, high);
        if (arr[j] < pivot) {
            i++;
            await swap(i, j);
        }
        removeHighlightBars(j, high);
    }
    await swap(i + 1, high);
    return i + 1;
}

// Merge Sort Algorithm
async function mergeSort(arr, left, right) {
    if (left < right) {
        let mid = Math.floor((left + right) / 2);
        await mergeSort(arr, left, mid);
        await mergeSort(arr, mid + 1, right);
        await merge(arr, left, mid, right);
    }
    if (!sorting) return;
}

async function merge(arr, left, mid, right) {
    let n1 = mid - left + 1;
    let n2 = right - mid;
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[left + i];
    for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        if (!sorting) return;
        await swap(k, k);
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        await swap(k, k);
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        await swap(k, k);
        j++;
        k++;
    }
}

// Heap Sort Algorithm
async function heapSort() {
    let n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (!sorting) return;
        await heapify(n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        if (!sorting) return;
        await swap(0, i);
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) largest = left;
    if (right < n && array[right] > array[largest]) largest = right;

    if (largest !== i) {
        await swap(i, largest);
        await heapify(n, largest);
    }
}

// Radix Sort Algorithm
async function radixSort() {
    if (!sorting) return; // Check if sorting is false right away
    let max = Math.max(...array); // Find the maximum number in the array
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        if (!sorting) return; // Check before each countingSort call
        await countingSort(exp); // Call counting sort for each exponent
    }
}

async function countingSort(exp) {
    let output = new Array(array.length);
    let count = new Array(10).fill(0);

    for (let i = 0; i < array.length; i++) {
        count[Math.floor(array[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (let i = array.length - 1; i >= 0; i--) {
        output[count[Math.floor(array[i] / exp) % 10] - 1] = array[i];
        count[Math.floor(array[i] / exp) % 10]--;
    }

    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        if (!sorting) return; // Check after setting the output
        await swap(i, i); // Update the bar heights
    }
}

// Shell Sort Algorithm
async function shellSort() {
    let n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                if (!sorting) return; // Check before each swap
                array[j] = array[j - gap];
                updateBarHeight(j); // Update the bar height without using swap
                await new Promise(resolve => setTimeout(resolve, delay)); // Delay for animation
            }
            array[j] = temp;
            updateBarHeight(j); // Update the bar height for the inserted key
        }
    }
}

// -----------------------------------------
// Helper Functions
// -----------------------------------------

// Helper function to swap two elements in the array and visually update the bars
async function swap(i, j) {
    [array[i], array[j]] = [array[j], array[i]];
    const bars = document.getElementsByClassName('bar');

    bars[i].style.transition = `transform ${delay}ms ease, height ${delay}ms ease, background-color ${delay}ms ease`;
    bars[j].style.transition = `transform ${delay}ms ease, height ${delay}ms ease, background-color ${delay}ms ease`;

    bars[i].style.transform = 'scale(1.1)';
    bars[j].style.transform = 'scale(1.1)';

    bars[i].style.backgroundColor = '#e74c3c';
    bars[j].style.backgroundColor = '#e74c3c';

    await new Promise(resolve => setTimeout(resolve, delay));

    bars[i].style.height = `${array[i] * 2}px`;
    bars[j].style.height = `${array[j] * 2}px`;

    await new Promise(resolve => setTimeout(resolve, delay));

    bars[i].style.transform = 'scale(1)';
    bars[j].style.transform = 'scale(1)';

    bars[i].style.backgroundColor = 'teal';
    bars[j].style.backgroundColor = 'teal';

    await new Promise(resolve => setTimeout(resolve, delay));
}

// Helper function to highlight bars during sorting
function highlightBars(index1, index2) {
    const bars = document.getElementsByClassName('bar');
    bars[index1].style.backgroundColor = 'yellow';
    bars[index2].style.backgroundColor = 'yellow';
}

// Helper function to remove highlight from bars
function removeHighlightBars(index1, index2) {
    const bars = document.getElementsByClassName('bar');
    bars[index1].style.backgroundColor = 'teal';
    bars[index2].style.backgroundColor = 'teal';
}

// Function to update the height of a bar without swapping
function updateBarHeight(index) {
    const bars = document.getElementsByClassName('bar');
    bars[index].style.height = `${array[index] * 2}px`;
    bars[index].style.backgroundColor = 'teal'; // Reset color after update
}

// Generate the initial array and render it
generateArray();
