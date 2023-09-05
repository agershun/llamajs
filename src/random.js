function randomU32(state) {
  state = BigInt(state);

  state ^= state >> BigInt(12);
  state ^= state << BigInt(25);
  state ^= state >> BigInt(27);
  return Number((state * BigInt("0x2545F4914F6CDD1D")) >> BigInt(32));
}

function randomF32(state) {
  let u32 = randomU32(state);

  return (u32 >> 8) / 16777216.0;
}

module.exports = { randomF32, randomU32 };
