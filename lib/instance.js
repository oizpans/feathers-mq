const NATS = require('nats');

module.exports = function getInstance(natsConfig = {}) {
  const url = natsConfig.url || 'localhost';
  const port = natsConfig.port || 4222;
  const jsonMode = natsConfig.json || true;

  return NATS.connect({ url: `nats://${url}:${port}`, json: jsonMode });
};
