function sampleArgmax(probabilities, vocabSize) {
  let maxIdx = 0;
  let maxP = probabilities[0];

  for (let i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > maxP) {
      maxIdx = i;
      maxP = probabilities[i];
    }
  }

  return maxIdx;
}

module.exports = sampleArgmax;