const { compare } = require("./compare");

function sampleTopp(probabilities, topp, probIndex, coin) {
  let n0 = 0;

  let cutoff = (1 - topp) / (probabilities.length - 1);

  for (let i = 0; i < probabilities.length; i++) {
    if (probabilities[i] >= cutoff) {
      probIndex[n0].index = i;
      probIndex[n0].prob = probabilities[i];
      n0++;
    }
  }
  probIndex.sort(compare);

  let cumulativeProb = 0;
  let lastIdx = n0 - 1;

  for (let i = 0; i < n0; i++) {
    cumulativeProb += probIndex[i].prob;
    if (cumulativeProb > topp) {
      lastIdx = i;
      break;
    }
  }

  let r = coin * cumulativeProb;
  let cdf = 0;

  for (let i = 0; i <= lastIdx; i++) {
    cdf += probIndex[i].prob;
    if (r < cdf) return probIndex[i].index;
  }

  return probIndex[lastIdx].index;
}

module.exports = sampleTopp;
