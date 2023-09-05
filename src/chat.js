async function chat(transformer, tokenizer, sampler, userPrompt, sysPrompt, steps) {

  let bufferSize = 1024;
  let userBuffer = Buffer.alloc(bufferSize);
  let sysBuffer = Buffer.alloc(bufferSize);

  let renderedPrompt = '';
  let promptTokens = [];

  let token, next, pos = 0;
  let userTurn = true;

  while(pos < steps) {

    if (userTurn) {

      // get system prompt
      if (pos === 0 && sysPrompt) {
        renderedPrompt += `[SYS] ${sysPrompt}\n\n`;
      }

      // get user prompt  
      process.stdout.write('User: ');
      let n = await process.stdin.read(userBuffer);
      let userInput = userBuffer.slice(0, n).toString();
      renderedPrompt += `[USER] ${userInput} [/USER]`;

      // encode prompt  
      encode(tokenizer, renderedPrompt, 1, 0, promptTokens);
      let userIdx = 0;
      userTurn = false;

      console.log('\nAssistant: ');

    }

    // get token
    if (userIdx < promptTokens.length) {
      token = promptTokens[userIdx++]; 
    } else {
      token = next;
    }

    // finish assistant turn on EOS
    if (token === 2) {
      userTurn = true;
      continue;
    }

    // forward pass
    let logits = forward(transformer, token, pos);
    next = sample(sampler, logits);

    // print assistant response
    if (userIdx >= promptTokens.length && next !== 2) {
      let piece = decode(tokenizer, token, next);
      process.stdout.write(piece);
    }

    pos++;

  }

  console.log();

}

module.exports = chat;