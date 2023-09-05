
function buildSampler(vocabSize, temperature, topp, rngSeed) {
  const probIndex = Array(vocabSize);

  for(let i=0;i<vocabSize;i++) {
    probIndex[i] = {index:0,prob:0.0};
  }

  return {
    vocabSize,
    temperature,
    topp, 
    rngState: rngSeed,
    probIndex: probIndex
  };
}

module.exports = buildSampler;