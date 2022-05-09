// https://stackabuse.com/insertion-sort-in-javascript/
async function insertionSort(array) {
  let n = array.length;
  for (let i = 1; i < n; i++) {
    highlightIndexes[0] = i;

    // Choosing the first element in our unsorted subarray
    let current = array[i];
    // The last element of our sorted subarray
    let j = i - 1;
    while (j > -1 && current < array[j]) {
      array[j + 1] = array[j];
      j--;

      highlightIndexes[1] = j;
      await sleep(sleepTime);
    }
    array[j + 1] = current;
  }
  highlightIndexes = [];
  return array;
}
