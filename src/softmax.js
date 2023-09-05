function softmax(x, size) {

  // find max value 
  let maxVal = x[0];
  for (let i = 1; i < size; i++) {
    if (x[i] > maxVal) {
      maxVal = x[i]; 
    }
  }

  // exp and sum
  let sum = 0;
  for (let i = 0; i < size; i++) {
    x[i] = Math.exp(x[i] - maxVal);
    sum += x[i];
  }

  // normalize 
  for (let i = 0; i < size; i++) {
    x[i] /= sum;
  }

}

module.exports = softmax;