// https://www.stdio.vn/giai-thuat-lap-trinh/bubble-sort-va-shaker-sort-01Si3U
async function shakerSort(array) {
  let left = 0;
  let right = array.length - 1;
  let k = 0;
  while (left < right) {
    for (let i = left; i < right; i++) {
      if (array[i] > array[i + 1]) {
        swap(array, i, i + 1);
        k = i;
      }
      highlightIndexes[1] = i + 1;
      await sleep(sleepTime);
    }
    right = k;
    for (i = right; i > left; i--) {
      if (array[i] < array[i - 1]) {
        swap(array, i, i - 1);
        k = i;
      }
      highlightIndexes[1] = i - 1;
      await sleep(sleepTime);
    }
    left = k;
  }
  highlightIndexes = [];
}
