function mallocRunState(state,config) {

  let kvDim = (config.dim * config.nKVHeads) / config.nHeads;

  state.x = new Float32Array(config.dim);
  state.xb = new Float32Array(config.dim);
  state.xb2 = new Float32Array(config.dim);
  
  state.hb = new Float32Array(config.hiddenDim);
  state.hb2 = new Float32Array(config.hiddenDim);

  state.q = new Float32Array(config.dim);
  state.k = new Float32Array(kvDim);
  state.v = new Float32Array(kvDim);

  state.att = new Float32Array(config.nHeads * config.seqLen);

  state.logits = new Float32Array(config.vocabSize);

  state.keyCache = new Float32Array(config.nLayers * config.seqLen * kvDim);
  state.valueCache = new Float32Array(config.nLayers * config.seqLen * kvDim);

}

module.exports = mallocRunState;