function compare(a, b) {
  if (a.prob > b.prob) return -1;
  if (a.prob < b.prob) return 1;
  return 0;
}

function compareTokens(a, b) {
  if (a.str > b.str) return -1;
  if (a.str < b.str) return 1;
  return 0;
}

module.exports = { compare, compareTokens };
