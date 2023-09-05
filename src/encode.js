const { compareTokens } = require("./compare");

function encode(t, text, bos, eos, tokens) {
  if (!t.sortedVocab) {
    t.sortedVocab = [];
    for (let i = 0; i < t.vocabSize; i++) {
      t.sortedVocab.push({ str: t.vocab[i], id: i });
    }
    t.sortedVocab = t.sortedVocab.sort(compareTokens);
  }

  let nTokens = 0;

  if (bos) {
    tokens[nTokens] = 1;
    nTokens++;
  }

  if (text) {
    let dummyPrefix = t.sortedVocab[0].id;
    tokens[nTokens] = dummyPrefix;
    nTokens++;
  }

  for (let i = 0; i < text.length; i++) {
    let char = text.charCodeAt(i);

    if ((char & 0xc0) != 0x80) {
      let piece = String.fromCharCode(char);

      let id = t.sortedVocab.findIndex(item => item.str === piece);
      if (id != -1) {
        tokens[nTokens] = id;
        nTokens++;
      } else {
        tokens[nTokens] = char + 3;
        nTokens++;
      }
    }
  }

  while (true) {
    let bestScore = -Infinity;
    let bestId = -1;
    let bestIdx = -1;

    for (let i = 0; i < nTokens - 1; i++) {
      let pair = t.vocab[tokens[i]] + t.vocab[tokens[i + 1]];
      let id = t.sortedVocab.findIndex(item => item.str === pair);
      
      if (id != -1 && t.vocabScores[id] > bestScore) {
        bestScore = t.vocabScores[id];
        bestId = id;
        bestIdx = i;
      }
    }

    if (bestIdx == -1) break;

    tokens[bestIdx] = bestId;

    for (let i = bestIdx + 1; i < nTokens - 1; i++) {
      tokens[i] = tokens[i + 1];
    }
    nTokens--;
  }

  if (eos) {
    tokens[nTokens] = 2;
    nTokens++;
  }
  return nTokens;
}

module.exports = encode;
