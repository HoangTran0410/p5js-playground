// https://www.w3resource.com/javascript-exercises/searching-and-sorting-algorithm/searching-and-sorting-algorithm-exercise-6.php
async function shellSort(array) {
  var increment = array.length / 2;
  while (increment > 0) {
    for (i = increment; i < array.length; i++) {
      highlightIndexes[0] = i;
      var j = i;
      var temp = array[i];

      while (j >= increment && array[j - increment] > temp) {
        array[j] = array[j - increment];
        j = j - increment;

        highlightIndexes[1] = j;
        await sleep(sleepTime);
      }

      array[j] = temp;
      await sleep(sleepTime);
    }

    if (increment == 2) {
      increment = 1;
    } else {
      increment = parseInt((increment * 5) / 11);
    }
  }
  highlightIndexes = [];
  return array;
}
