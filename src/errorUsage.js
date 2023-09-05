function errorUsage() {

  console.log('Usage:   run <checkpoint> [options]');
  console.log('Example: run model.bin -n 256 -i "Once upon a time"');
  console.log('Options:');
  console.log('  -t <float>  temperature in [0,inf], default 1.0');
  console.log('  -p <float>  p value for nucleus sampling in [0,1], default 0.9'); 
  console.log('  -s <int>    random seed, default time(NULL)');
  console.log('  -n <int>    number of steps to run for, default 256');
  console.log('  -i <string> input prompt');
  console.log('  -z <string> custom tokenizer path');
  console.log('  -m <string> mode: generate|chat, default: generate');
  console.log('  -y <string> system prompt in chat mode');

  process.exit(1);

}

module.exports = errorUsage;