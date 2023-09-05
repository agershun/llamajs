const {main} = require('../src/main');
const {decode} = require('../src/decode');
const {buildTokenizer} = require('../src/buildTokenizer');

// const t = {bytePieces:[]};
// buildTokenizer(t, './models/tokenizer.bin', 32000);
// // console.log(t.vocab.join(','));
// // console.log(t.vocabScores.join(','));
// // console.log('maxTokenLength=',t.maxTokenLength);
// console.log('bytePieces=',JSON.stringify(t.bytePieces));

// const piece = decode(t,64,65);

// console.log(piece);

main();