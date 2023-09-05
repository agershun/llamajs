const fs = require('fs');
const memoryMapWeights = require('./memoryMapWeights');

const SIZE_OF_FLOAT = 4;
const SIZE_OF_CONFIG = SIZE_OF_FLOAT*7;

async function readCheckpoint(checkpointPath) {
  let data = await fs.promises.readFile(checkpointPath);

  let view = new DataView(data.buffer);
  let config = {};
  config.dim = view.getInt32(SIZE_OF_FLOAT*0, true);
  config.hiddenDim = view.getInt32(SIZE_OF_FLOAT*1, true);
  config.nLayers = view.getInt32(SIZE_OF_FLOAT*2, true);
  config.nHeads = view.getInt32(SIZE_OF_FLOAT*3, true);
  config.nKVHeads = view.getInt32(SIZE_OF_FLOAT*4, true);
  config.vocabSize = Math.abs(view.getInt32(SIZE_OF_FLOAT*5, true));
  config.seqLen = view.getInt32(SIZE_OF_FLOAT*6, true);
  let offset = SIZE_OF_CONFIG;


  const sharedWeights = config.vocabSize > 0 ? 1 : 0;

  let weights = {};
  
  memoryMapWeights(weights, config, data, sharedWeights, offset);

  return {
    config: config,
    weights: weights,
  };
}

module.exports = readCheckpoint;
