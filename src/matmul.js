function matmul(xout, x, w, n, d) {

  for (let i = 0; i < d; i++) {
    let val = 0;
    for (let j = 0; j < n; j++) {
      val += w[i*n + j] * x[j];
    }
    xout[i] = val; 
  }

}

module.exports = matmul;