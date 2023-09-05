const fs = require("fs");

async function buildTokenizer(tokenizer, tokenizerPath, vocabSize) {
  tokenizer.vocabSize = vocabSize;

  tokenizer.vocab = [];
  tokenizer.vocabScores = [];
  tokenizer.bytePieces = Array(512).fill("");

  for (let i = 0; i < 256; i++) {
    tokenizer.bytePieces[i * 2] = String.fromCharCode(i);
    tokenizer.bytePieces[i * 2 + 1] = "";
  }

  // read in file
  let data = await fs.promises.readFile(tokenizerPath);

  // parse header
  let view = new DataView(data.buffer);
  tokenizer.maxTokenLength = view.getInt32(0, true);

  // read vocab
  let offset = 4;
  for (let i = 0; i < vocabSize; i++) {
    tokenizer.vocabScores[i] = view.getFloat32(offset, true);
    offset += 4;

    let len = view.getInt32(offset, true);
    offset += 4;

    let str = "";
    for (let j = 0; j < len; j++) {
      str += String.fromCharCode(data[offset++]);
    }
    tokenizer.vocab[i] = str;
  }
}

module.exports = buildTokenizer;
