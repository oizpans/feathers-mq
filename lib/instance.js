const NATS = require('nats');

let instance = null;

module.exports = function getInstance(natsConfig = {}) {
  const url = natsConfig.url || 'localhost';
  const port = natsConfig.port || 4222;
  const jsonMode = natsConfig.json || true;

  if (!instance) {
    instance = NATS.connect({ url: `nats://${url}:${port}`, json: jsonMode });

    return instance;
  }

  return instance;
};
