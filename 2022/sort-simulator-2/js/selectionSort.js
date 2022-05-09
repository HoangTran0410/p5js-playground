// https://stackabuse.com/selection-sort-in-javascript/
async function selectionSort(array) {
  let n = array.length;

  for (let i = 0; i < n; i++) {
    highlightIndexes[0] = i;
    // Finding the smallest number in the subarray
    let min = i;
    for (let j = i + 1; j < n; j++) {
      await sleep(sleepTime);
      highlightIndexes[1] = j;
      if (array[j] < array[min]) {
        highlightIndexes[2] = j;
        min = j;
      }
    }
    if (min != i) {
      // Swapping the elements
      let tmp = array[i];
      array[i] = array[min];
      array[min] = tmp;
    }
  }

  highlightIndexes = [];
  return array;
}
