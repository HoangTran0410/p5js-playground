let arr = [];
let highlightIndexes = [];
let sleepTime = 10;
let arrToAnimations = [];

let delaySlider;
let isSorting = false;

const lineWidth = 7;

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

function setup() {
  createCanvas(min(windowWidth, 800), 500);
  colorMode(HSB, 100);

  let len = ~~(width / lineWidth);
  for (let i = 0; i < len; i++) arr.push(map(i, 0, len, 0, 100));
  arrToAnimations = getCurrentState();
  console.log(arrToAnimations);

  shuffleArray(arr);

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
  // createButton("Radix Sort").mouseClicked((e) => {
  //   runSort(radixSort, arr, e.target);
  // });
}

function draw() {
  background(20);

  sleepTime = delaySlider.value();

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

    let h = map(value, 0, 100, 0, height);
    let top = height - h;
    let left = currentIndex * lineWidth;

    // fill(value, 255, 100);
    // rect(left, top, lineWidth, h);
    stroke(value, 255, 100);
    strokeWeight(lineWidth - 2);
    line(left + lineWidth / 2, top, left + 50, height);

    let hi = highlightIndexes.indexOf(indexInArr);
    if (hi >= 0) {
      fill(255);
      noStroke();
      rect(left, 0, lineWidth, height - h);
    }
  }
}
