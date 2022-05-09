// https://learnersbucket.com/examples/algorithms/quick-sort-iterative/
async function partitionHigh(array, low, high) {
  //Pick the first element as pivot
  let pivot = array[high];
  let i = low;

  //Partition the array into two parts using the pivot
  for (let j = low; j < high; j++) {
    highlightIndexes[2] = j;
    await sleep(sleepTime);
    if (array[j] <= pivot) {
      swap(array, i, j);
      i++;
      highlightIndexes[3] = i;
    }
  }

  swap(array, i, high);

  //Return the pivot index
  return i;
}

async function quickSort(array) {
  //Stack for storing start and end index
  let stack = [];

  //Get the start and end index
  let start = 0;
  let end = array.length - 1;

  //Push start and end index in the stack
  stack.push({ x: start, y: end });

  //Iterate the stack
  while (stack.length) {
    //Get the start and end from the stack
    const { x, y } = stack.shift();

    highlightIndexes[0] = x;
    highlightIndexes[1] = y;

    //Partition the array along the pivot
    const i = await partitionHigh(array, x, y);

    //Push sub array with less elements than pivot into the stack
    if (i - 1 > x) {
      stack.push({ x: x, y: i - 1 });
    }

    //Push sub array with greater elements than pivot into the stack
    if (i + 1 < y) {
      stack.push({ x: i + 1, y: y });
    }
  }

  highlightIndexes = [];
}
