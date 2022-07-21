let arr = [];
let highlightIndexes = [];
let sleepTime = 10;

let delaySlider;
let isSorting = false;

async function runSort(sortFunc, array, button) {
  if (!isSorting) {
    button.classList.add("loading");
    isSorting = true;
    await sortFunc(array);
    isSorting = false;
    button.classList.remove("loading");
  }
}

function setup() {
  createCanvas(min(windowWidth, 800), 500);
  colorMode(HSB, 100);

  for (let i = 0; i < ~~(width / 10); i++) arr.push(~~random(100));

  delaySlider = createSlider(0, 100, 10, 2);

  createButton("Shuffle").mouseClicked((e) => {
    runSort(shuffleArray, arr, e.target);
  });
  createButton("Bubble Sort").mouseClicked((e) => {
    runSort(bubbleSort, arr, e.target);
  });
  createButton("Selection Sort").mouseClicked((e) => {
    runSort(selectionSort, arr, e.target);
  });
  createButton("Merge Sort").mouseClicked((e) => {
    // alert("Not implemented yet");
    runSort(mergeSort, arr, e.target);
  });
  createButton("Insertion Sort").mouseClicked((e) => {
    runSort(insertionSort, arr, e.target);
  });
  createButton("Binary Insertion Sort").mouseClicked((e) => {
    runSort(binaryInsertionSort, arr, e.target);
  });
  createButton("Shaker Sort").mouseClicked((e) => {
    runSort(shakerSort, arr, e.target);
  });
  createButton("Shell Sort").mouseClicked((e) => {
    runSort(shellSort, arr, e.target);
  });
  createButton("Quick Sort").mouseClicked((e) => {
    runSort(quickSort, arr, e.target);
  });
  createButton("Radix Sort").mouseClicked((e) => {
    runSort(radixSort, arr, e.target);
  });
}

function draw() {
  background(20);

  sleepTime = delaySlider.value();
  let w = width / arr.length;

  noStroke();
  for (let i = 0; i < arr.length; i++) {
    let value = arr[i];
    let h = map(value, 0, 100, 0, height);
    let top = height - h;
    let left = i * w;

    fill(value, 255, 255);
    rect(left, top, w, h);

    let hi = highlightIndexes.indexOf(i);
    if (hi >= 0) {
      fill(255);
      rect(left, 0, w, height - h);
    }
  }
}
