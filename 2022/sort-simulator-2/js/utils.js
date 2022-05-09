function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

function sleep(ms) {
  if (ms === 0) return;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// https://bost.ocks.org/mike/shuffle/
async function shuffleArray(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;

    highlightIndexes[0] = m;
    highlightIndexes[1] = i;
    await sleep(sleepTime);
  }

  highlightIndexes = [];

  return array;
}
