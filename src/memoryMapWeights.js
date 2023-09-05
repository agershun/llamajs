function memoryMapWeights(weights, config, data, sharedWeights,offset) {

  let headSize = config.dim / config.nHeads;

  weights.tokenEmbeddingTable = new Float32Array(data.buffer, offset, config.vocabSize * config.dim);
  offset += weights.tokenEmbeddingTable.byteLength;

  weights.rmsAttWeight = new Float32Array(data.buffer, offset, config.nLayers * config.dim);
  offset += weights.rmsAttWeight.byteLength;

  weights.wq = new Float32Array(data.buffer, offset, config.nLayers * config.dim * config.nHeads * headSize);
  offset += weights.wq.byteLength;

  weights.wk = new Float32Array(data.buffer, offset, config.nLayers * config.dim * config.nKVHeads * headSize);
  offset += weights.wk.byteLength;

  weights.wv = new Float32Array(data.buffer, offset, config.nLayers * config.dim * config.nKVHeads * headSize);
  offset += weights.wv.byteLength;

  weights.wo = new Float32Array(data.buffer, offset, config.nLayers * config.nHeads * headSize * config.dim);
  offset += weights.wo.byteLength;

  weights.rmsFFNWeight = new Float32Array(data.buffer, offset, config.nLayers * config.dim);
  offset += weights.rmsFFNWeight.byteLength;

  weights.w1 = new Float32Array(data.buffer, offset, config.nLayers * config.dim * config.hiddenDim);
  offset += weights.w1.byteLength;

  weights.w2 = new Float32Array(data.buffer, offset, config.nLayers * config.hiddenDim * config.dim );
  offset += weights.w2.byteLength;

  weights.w3 = new Float32Array(data.buffer, offset, config.nLayers * config.dim * config.hiddenDim);
  offset += weights.w3.byteLength;

  weights.rmsFinalWeight = new Float32Array(data.buffer, offset, config.dim);
  offset += weights.rmsFinalWeight.byteLength;

  offset += config.seqLen * headSize / 2;
  offset += config.seqLen * headSize / 2;

  if (!sharedWeights) {
    weights.wcls = new Float32Array(data.buffer, offset, config.vocabSize * config.dim); 
  } else {
    weights.wcls = weights.tokenEmbeddingTable; 
  }

}

module.exports = memoryMapWeights;