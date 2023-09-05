const exp = require("constants");
const rmsnorm = require('./rmsnorm');
const matmul = require('./matmul');
const softmax = require('./softmax');

function forward(transformer, token, pos) {

  // a few convenience variables
  const p = transformer.config; 
  const w = transformer.weights;
  const s = transformer.state;
  let x = s.x;
  const dim = p.dim;
  const kvDim = (p.dim * p.nKVHeads) / p.nHeads;
  const kvMul = p.nHeads / p.nKVHeads;
  const hiddenDim = p.hiddenDim;  
  const headSize = dim / p.nHeads;

  // copy the token embedding into x
  x.set(w.tokenEmbeddingTable.subarray(token * dim, (token + 1) * dim));

  // forward all the layers
  for (let l = 0; l < p.nLayers; l++) {

    // attention rmsnorm
    rmsnorm(s.xb, x, w.rmsAttWeight.subarray(l * dim, (l + 1) * dim), dim);
 
  
    // qkv matmuls for this position
    matmul(s.q, s.xb, w.wq.subarray(l * dim * dim, (l + 1) * dim * dim), dim, dim);
    matmul(s.k, s.xb, w.wk.subarray(l * dim * kvDim, (l + 1) * dim * kvDim), dim, kvDim);
    matmul(s.v, s.xb, w.wv.subarray(l * dim * kvDim, (l + 1) * dim * kvDim), dim, kvDim);

    // RoPE relative positional encoding
    for (let i = 0; i < dim; i += 2) {
      const headDim = i % headSize;
      const freq = 1 / Math.pow(10000, headDim / headSize);    
      const val = pos * freq;
      const fcr = Math.cos(val);
      const fci = Math.sin(val);
      const rotn = i < kvDim ? 2 : 1; 
      for (let v = 0; v < rotn; v++) {
        let vec = v === 0 ? s.q : s.k;
        const v0 = vec[i];
        const v1 = vec[i+1];
        vec[i] = v0 * fcr - v1 * fci;
        vec[i+1] = v0 * fci + v1 * fcr;
      }
    }


    // save k/v to cache
    const loff = l * p.seqLen * kvDim;

    const keyCacheRow = s.keyCache.subarray(loff + pos * kvDim, loff + (pos + 1) * kvDim);
    const valueCacheRow = s.valueCache.subarray(loff + pos * kvDim, loff + (pos + 1) * kvDim);
    keyCacheRow.set(s.k);
    valueCacheRow.set(s.v);

    // multihead attention
    for (let h = 0; h < p.nHeads; h++) {
      // get q vector for this head  
      const q = s.q.subarray(h * headSize, (h + 1) * headSize);
      // att scores for this head
      const att = s.att.subarray(h * p.seqLen, (h + 1) * p.seqLen);
      
      for (let t = 0; t <= pos; t++) {
        // get k vector
        const k = s.keyCache.subarray(loff + t * kvDim + Math.floor(h / kvMul) * headSize, loff + t * kvDim + Math.floor(h / kvMul) * headSize + headSize);

        // att score
        let score = 0;
        for (let i = 0; i < headSize; i++) {
          score += q[i] * k[i];
        }
        score /= Math.sqrt(headSize);
        // save to att buffer  
        att[t] = score; 
      }
      // softmax att weights  
      softmax(att, pos + 1);

      // weighted sum of v into xb
      const xb = s.xb.subarray(h * headSize, (h + 1) * headSize);
      xb.fill(0);
      for (let t = 0; t <= pos; t++) {
        const v = s.valueCache.subarray(loff + t * kvDim + Math.floor(h / kvMul) * headSize, loff + t * kvDim + Math.floor(h / kvMul) * headSize + headSize);
        const a = att[t];
        for (let i = 0; i < headSize; i++) {
          xb[i] += a * v[i];
        }
      }
    }

    // final matmul to get att output 
    matmul(s.xb2, s.xb, w.wo.subarray(l * dim * dim, (l + 1) * dim * dim), dim, dim);

    // residual connection 
    for (let i = 0; i < dim; i++) {
      x[i] += s.xb2[i]; 
    }

    // ffn rmsnorm
    rmsnorm(s.xb, x, w.rmsFFNWeight.subarray(l * dim, (l + 1) * dim), dim);

    // w1 and w3 matmuls
    matmul(s.hb, s.xb, w.w1.subarray(l * dim * hiddenDim, (l + 1) * dim * hiddenDim), dim, hiddenDim);
    matmul(s.hb2, s.xb, w.w3.subarray(l * dim * hiddenDim, (l + 1) * dim * hiddenDim), dim, hiddenDim);

    // SwiGLU non-linearity
    for (let i = 0; i < hiddenDim; i++) {
      let val = s.hb[i];
      val *= 1 / (1 + Math.exp(-val)); 
      val *= s.hb2[i];
      s.hb[i] = val;
    }

    // final matmul for ffn output
    matmul(s.xb, s.hb, w.w2.subarray(l * hiddenDim * dim, (l + 1) * hiddenDim * dim), hiddenDim, dim);

    // residual connection
    for (let i = 0; i < dim; i++) {
      x[i] += s.xb[i];
    }
  }

  // final rmsnorm
  rmsnorm(x, x, w.rmsFinalWeight, dim);

  // classifier into logits
  matmul(s.logits, x, w.wcls, p.dim, p.vocabSize);

  return s.logits;
}

module.exports = forward;