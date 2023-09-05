function rmsnorm(o, x, weight, size) {

  // calculate sum of squares  
  let ss = 0.0;
  for (let j = 0; j < size; j++) {
    ss += x[j] * x[j];
  }
  ss /= size;
  ss += 1e-5; 
  ss = 1.0 / Math.sqrt(ss);

  // normalize and scale
  for (let j = 0; j < size; j++) {
    o[j] = weight[j] * (ss * x[j]);
  }
}

module.exports = rmsnorm;