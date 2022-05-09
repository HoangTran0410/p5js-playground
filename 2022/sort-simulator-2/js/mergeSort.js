// https://www.geeksforgeeks.org/iterative-merge-sort/
async function mergeSort(array) {
  if (array == null) {
    return;
  }

  if (array.length > 1) {
    var mid = parseInt(array.length / 2);

    // Split left part
    var left = Array(mid).fill(0);
    for (i = 0; i < mid; i++) {
      left[i] = array[i];
    }

    // Split right part
    var right = Array(array.length - mid).fill(0);
    for (i = mid; i < array.length; i++) {
      right[i - mid] = array[i];
    }
    mergeSort(left);
    mergeSort(right);

    var i = 0;
    var j = 0;
    var k = 0;

    // Merge left and right arrays
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        array[k] = left[i];
        i++;
      } else {
        array[k] = right[j];
        j++;
      }
      k++;

      highlightIndexes[0] = k;
      await sleep(sleepTime);
    }

    // Collect remaining elements
    while (i < left.length) {
      array[k] = left[i];
      i++;
      k++;
    }
    while (j < right.length) {
      array[k] = right[j];
      j++;
      k++;
    }
  }

  highlightIndexes = [];
}
