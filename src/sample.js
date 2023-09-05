const sampleArgmax = require('./sampleArgmax');
const sampleMult = require('./sampleMult');
const sampleTopp = require('./sampleTopp');
const softmax = require('./softmax');

const { randomF32, randomU32 } = require('./random');


function sample(sampler, logits) {

  
  let next;

  if (sampler.temperature == 0) {
    // argmax sampling
    next = sampleArgmax(logits,sampler.vocabSize);
    // console.log(5,next);
    // process.exit(0);


  } else {
    

    // apply temperature
    // for (let i = 0; i < logits.length; i++) {
    for (let i = 0; i < sampler.vocabSize; i++) {
      logits[i] /= sampler.temperature; 
    }

    // console.log(5,sampler.temperature);
    // process.exit(0);

    // softmax
    // let sum = 0;
    // let max = Math.max(...logits);
    // for (let i = 0; i < logits.length; i++) {
    //   logits[i] = Math.exp(logits[i] - max);
    //   sum += logits[i];
    // }
    // for (let i = 0; i < logits.length; i++) {
    //   logits[i] /= sum;
    // }

    softmax(logits, sampler.vocabSize);

// console.log(46,'sampler.rngState',sampler.rngState);
    // sampling
    let coin = Number(randomF32(sampler.rngState));

    // console.log(50,'coin',coin);

    if (sampler.topp <= 0 || sampler.topp >= 1) {
      next = sampleMult(logits, sampler.vocabSize,coin);
    } else {
      next = sampleTopp(logits, sampler.topp, sampler.probIndex, coin); 
    }

  }

  return next;

}

module.exports = sample;