// https://www.geeksforgeeks.org/binary-insertion-sort/
function binarySearch(a, item, low, high) {
  if (high <= low) return item > a[low] ? low + 1 : low;
  mid = Math.floor((low + high) / 2);
  if (item == a[mid]) return mid + 1;
  if (item > a[mid]) return binarySearch(a, item, mid + 1, high);

  return binarySearch(a, item, low, mid - 1);
}

async function binaryInsertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    highlightIndexes[0] = i;
    let j = i - 1;
    let x = array[i];

    // Find location to insert
    // using binary search
    let loc = Math.abs(binarySearch(array, x, 0, j));

    // Shifting array to one
    // location right

    while (j >= loc) {
      array[j + 1] = array[j];
      j--;

      highlightIndexes[1] = loc;
      highlightIndexes[2] = j;
      await sleep(sleepTime);
    }

    // Placing element at its
    // correct location
    array[j + 1] = x;
  }
  highlightIndexes = [];
}
