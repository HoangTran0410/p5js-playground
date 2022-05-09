let arr = [];
let highlightIndexes = [];
let sleepTime = 10;

let delaySlider;

function setup() {
  createCanvas(min(windowWidth, 800), 500);
  colorMode(HSB, 100);

  for (let i = 0; i < 50; i++) arr.push(~~random(100));

  delaySlider = createSlider(0, 250, 10, 5);

  createButton("Shuffle").mouseClicked(() => {
    shuffleArray(arr);
  });
  createButton("Bubble Sort").mouseClicked(() => {
    bubbleSort(arr);
  });
  createButton("Selection Sort").mouseClicked(() => {
    selectionSort(arr);
  });
  createButton("Merge Sort").mouseClicked(() => {
    // alert("Not implemented yet");
    mergeSort(arr);
  });
  createButton("Insertion Sort").mouseClicked(() => {
    insertionSort(arr);
  });
  createButton("Binary Insertion Sort").mouseClicked(() => {
    binaryInsertionSort(arr);
  });
  createButton("Shaker Sort").mouseClicked(() => {
    shakerSort(arr);
  });
  createButton("Shell Sort").mouseClicked(() => {
    shellSort(arr);
  });
  createButton("Quick Sort").mouseClicked(() => {
    quickSort(arr);
  });
  createButton("Radix Sort").mouseClicked(() => {
    radixSort(arr);
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
