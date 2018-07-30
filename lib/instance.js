let nats = null;
const NATS = require('nats');

module.exports = function getInstance(natsConfig = {}) {
  const url = natsConfig.url || 'localhost';
  const port = natsConfig.url || 4222;

  if (!nats) {
    nats = NATS.connect({ url: `nats://${url}:${port}` }, { json: true });
    return nats;
  }
  return nats;
};
