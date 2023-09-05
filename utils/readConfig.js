const fs = require('fs');

// Config structure
class Config {
  constructor() {
    this.dim = 0;
    this.hidden_dim = 0;
    this.n_layers = 0;
    this.n_heads = 0;
    this.n_kv_heads = 0;
    this.vocab_size = 0;
    this.seq_len = 0;
  }

  fromBuffer(buffer) {
    this.dim = buffer.readInt32LE(0);
    this.hidden_dim = buffer.readInt32LE(4);
    this.n_layers = buffer.readInt32LE(8);
    this.n_heads = buffer.readInt32LE(12);
    this.n_kv_heads = buffer.readInt32LE(16);
    this.vocab_size = buffer.readInt32LE(20);
    this.seq_len = buffer.readInt32LE(24);
  }
}

const main = () => {
  const args = process.argv;

  if (args.length < 3) {
    console.log(`Usage: ${args[0]} ${args[1]} <model_file>`);
    process.exit(1);
  }

  const modelPath = args[2];

  // Open and read the file
  const fileBuffer = fs.readFileSync(modelPath);
  if (!fileBuffer) {
    console.log(`Could not open file ${modelPath}`);
    process.exit(1);
  }

  // Read the config from the buffer
  const config = new Config();
  config.fromBuffer(fileBuffer);

  // Print the config
  console.log('Config:');
  console.log(`  dim: ${config.dim}`);
  console.log(`  hidden_dim: ${config.hidden_dim}`);
  console.log(`  n_layers: ${config.n_layers}`);
  console.log(`  n_heads: ${config.n_heads}`);
  console.log(`  n_kv_heads: ${config.n_kv_heads}`);
  console.log(`  vocab_size: ${config.vocab_size}`);
  console.log(`  seq_len: ${config.seq_len}`);
};

main();
