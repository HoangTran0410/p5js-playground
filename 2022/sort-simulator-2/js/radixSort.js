// https://stackoverflow.com/a/38979903
// ONLY int value
async function radixSort(array) {
  var idx1, idx2, idx3, len1, len2, radix, radixKey;
  var radices = {},
    buckets = {},
    curr;
  var currLen, currBucket;

  len1 = array.length;
  len2 = 10; // radix sort uses ten buckets

  // find the relevant radices to process for efficiency
  for (idx1 = 0; idx1 < len1; idx1++) {
    radices[array[idx1].toString().length] = 0;
  }

  // loop for each radix. For each radix we put all the items
  // in buckets, and then pull them out of the buckets.
  for (radix in radices) {
    // put each array item in a bucket based on its radix value
    len1 = array.length;
    for (idx1 = 0; idx1 < len1; idx1++) {
      await sleep(sleepTime);
      highlightIndexes[0] = idx1;

      curr = array[idx1];
      // item length is used to find its current radix value
      currLen = curr.toString().length;
      // only put the item in a radix bucket if the item
      // key is as long as the radix
      if (currLen >= radix) {
        // radix starts from beginning of key, so need to
        // adjust to get redix values from start of stringified key
        radixKey = curr.toString()[currLen - radix];
        // create the bucket if it does not already exist
        if (!buckets.hasOwnProperty(radixKey)) {
          buckets[radixKey] = [];
        }
        // put the array value in the bucket
        buckets[radixKey].push(curr);
      } else {
        if (!buckets.hasOwnProperty("0")) {
          buckets["0"] = [];
        }
        buckets["0"].push(curr);
      }
    }
    // for current radix, items are in buckets, now put them
    // back in the array based on their buckets
    // this index moves us through the array as we insert items
    idx1 = 0;
    // go through all the buckets
    for (idx2 = 0; idx2 < len2; idx2++) {
      // only process buckets with items
      if (buckets[idx2] != null) {
        currBucket = buckets[idx2];
        // insert all bucket items into array
        len1 = currBucket.length;
        for (idx3 = 0; idx3 < len1; idx3++) {
          array[idx1++] = currBucket[idx3];

          await sleep(sleepTime);
          highlightIndexes[0] = idx1;
          highlightIndexes[1] = idx3;
        }
      }
    }
    buckets = {};
  }

  highlightIndexes = [];
}

// https://stackoverflow.com/a/3817440
async function radixSort2(array) {
  for (var div = 1, radix = 16; div < 65536 * 65536; div *= radix) {
    var piles = [];

    for (var i = 0; i < array.length; ++i) {
      var p = Math.floor(array[i] / div) % radix;
      (piles[p] || (piles[p] = [])).push(array[i]);
    }

    for (var i = 0, ai = 0; i < piles.length; ++i) {
      if (!piles[i]) continue;
      for (var pi = 0; pi < piles[i].length; ++pi) {
        array[ai++] = piles[i][pi];

        highlightIndexes[0] = ai;
        await sleep(sleepTime);
      }
    }
  }
  highlightIndexes = [];
}
