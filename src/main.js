const buildTransformer = require("./buildTransformer");
const buildTokenizer = require("./buildTokenizer");
const buildSampler = require("./buildSampler");
const generate = require("./generate");
const chat = require("./chat");
const errorUsage = require("./errorUsage");
const { freeTokenizer, freeTransformer, freeSampler } = require("./free");

main();
async function main() {
  let args = process.argv.slice(2);

  let checkpointPath = args[0];
  let tokenizerPath = "tokenizer.bin";

  let temperature = 1.0;
  let topp = 0.9;
  let steps = 256;
  let prompt = "";
  let rngSeed = 0;
  let mode = "generate";

  for (let i = 1; i < args.length; i += 2) {
    let arg = args[i];
    let value = args[i + 1];

    if (arg === "-t") {
      temperature = parseFloat(value);
    } else if (arg === "-p") {
      topp = parseFloat(value);
    } else if (arg === "-s") {
      rngSeed = parseInt(value);
    } else if (arg === "-n") {
      steps = parseInt(value);
    } else if (arg === "-i") {
      prompt = value;
    } else if (arg === "-z") {
      tokenizerPath = value;
    } else if (arg === "-m") {
      mode = value;
    }
  }

  if (rngSeed <= 0) rngSeed = Date.now();
  if (temperature < 0.0) temperature = 0.0;
  if (topp < 0.0 || 1.0 < topp) topp = 0.9;
  if (steps < 0) steps = 0;

  if (true) {
    console.log(51, "config", {
      checkpointPath,
      tokenizerPath,
      temperature,
      topp,
      steps,
      prompt,
      rngSeed,
      mode,
    });
  }

  const transformer = {};
  await buildTransformer(transformer, checkpointPath);

  const tokenizer = {};
  const vocabSize = transformer.config.vocabSize;
  await buildTokenizer(tokenizer, tokenizerPath, vocabSize);

  const sampler = buildSampler(vocabSize, temperature, topp, rngSeed);

  if (mode === "generate") {
    await generate(transformer, tokenizer, sampler, prompt, steps);
  } else if (mode === "chat") {
    await chat(transformer, tokenizer, sampler, prompt, null, steps);
  } else {
    errorUsage();
  }

  // freeTokenizer(tokenizer);
  // freeTransformer(transformer);
  // freeSampler(sampler);
}

module.exports = main;
