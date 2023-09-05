function sampleMult(probabilities, size,coin) {
  let cdf = 0.0;

  for (let i = 0; i < size; i++) {
    cdf += probabilities[i];
    if (coin < cdf) return i;
  }

  return probabilities.length - 1;
}

module.exports = sampleMult;