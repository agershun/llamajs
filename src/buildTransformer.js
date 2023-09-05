const readCheckpoint = require("./readCheckpoint");
const mallocRunState = require("./mallocRunState");

async function buildTransformer(t, checkpointPath) {
  // In JS, objects are passed by reference, so you can directly modify properties of the object.
  const res = await readCheckpoint(checkpointPath);
  t.config = res.config;
  t.weights = res.weights;
  t.state = {};
  mallocRunState(t.state, t.config);
}

// Note: The functions readCheckpoint and mallocRunState aren't provided, so they need to be implemented separately.

module.exports = buildTransformer;
