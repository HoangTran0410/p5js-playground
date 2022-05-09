// https://viblo.asia/p/javascript-algorithms-bubble-sort-djeZ1RRolWz
async function bubbleSort(array) {
  let isOrdered;
  for (let i = 0; i < array.length; i++) {
    isOrdered = true;
    for (let x = 0; x < array.length - 1 - i; x++) {
      if (array[x] > array[x + 1]) {
        swap(array, x, x + 1);
        isOrdered = false;

        highlightIndexes[1] = x + 1;
        await sleep(sleepTime);
      }
    }
    if (isOrdered) break;
  }

  highlightIndexes = [];
  return array;
}
