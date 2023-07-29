let arr = [];
let highlightIndexes = [];
let sleepTime = 10;
let arraySize = 100;
let arrToAnimations = [];

let delayInput, arrSizeInput;
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

function getCurrentState() {
  return arr.map((v, i) => ({
    value: v,
    realIndex: i, // real index in the sorted array
    targetIndex: 0,
    currentIndex: i, // current index in the array, can be float number
  }));
}

function createArray() {
  for (let i = 0; i < arraySize; i++) arr.push(map(i, 0, arraySize, 0, 100));
  arrToAnimations = getCurrentState();
  shuffleArray(arr, false);
}

function setup() {
  createCanvas(min(windowWidth, 800), 500);
  colorMode(HSB, 100);

  createArray(arraySize);

  createElement("lable", "Delay (ms):");
  delayInput = createInput("10");
  delayInput.attribute("type", "number");
  delayInput.attribute("min", "0");
  delayInput.attribute("max", "1000");
  delayInput.attribute("step", "10");

  createElement("lable", "Array size:");
  arrSizeInput = createInput("100");
  arrSizeInput.attribute("type", "number");
  arrSizeInput.attribute("min", "10");
  arrSizeInput.attribute("max", "400");
  arrSizeInput.input(() => {
    arraySize = arrSizeInput.value();
    createArray();
  });

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
  // createButton("Radix Sort").mouseClicked((e) => {
  //   runSort(radixSort, arr, e.target);
  // });
}

function draw() {
  background(20);

  sleepTime = delayInput.value();

  noStroke();
  for (let i = arrToAnimations.length - 1; i >= 0; i--) {
    let { value, realIndex, targetIndex, currentIndex } = arrToAnimations[i];

    let indexInArr = arr.indexOf(value);
    if (indexInArr >= 0) arrToAnimations[i].targetIndex = indexInArr;

    let lerpSpeed = 0.15;
    arrToAnimations[i].currentIndex = lerp(
      currentIndex,
      targetIndex,
      lerpSpeed
    );

    let w = width / arraySize;
    let h = map(value, 0, 100, 0, height);
    let top = height - h;
    let left = currentIndex * w;

    // fill(value, 255, 100);
    // rect(left, top, w, h);
    stroke(value, 255, 100);
    strokeWeight(w - 2);
    line(left + w / 2, top, left + 50, height);

    let hi = highlightIndexes.indexOf(indexInArr);
    if (hi >= 0) {
      fill(255);
      noStroke();
      rect(left, 0, w, height - h);
    }
  }
}
