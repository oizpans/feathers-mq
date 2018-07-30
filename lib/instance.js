const NATS = require('nats');

let nats = null;

module.exports = function getInstance(natsConfig = {}) {
  const url = natsConfig.url || 'localhost';
  const port = natsConfig.url || 4222;
  const jsonMode = natsConfig.json || true;

  if (!nats) {
    nats = NATS.connect({ url: `nats://${url}:${port}`, json: jsonMode });
    return nats;
  }
  return nats;
};
