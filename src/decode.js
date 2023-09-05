function decode(t, prevToken, token) {

  let piece = t.vocab[token];

  // handle whitespace after BOS 
  if (prevToken === 1 && piece[0] === ' ') {
    piece = piece.substring(1); 
  }

  // handle raw byte tokens
  let matches = piece.match(/^<0x(\d{2})>$/);
  if (matches) {
    let byte = parseInt(matches[1], 16);
    piece = t.bytePieces[String.fromCharCode(byte)];
  }

  return piece;
}

module.exports = decode;