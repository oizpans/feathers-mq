const debug = require('debug')('nats-instance:');
const NATS = require('nats');

let instance = null;

module.exports = function getInstance(natsConfig = {}) {
  const url = natsConfig.url || 'localhost';
  const port = natsConfig.url || 4222;
  const jsonMode = natsConfig.json || true;

  if (!instance) {
    instance = NATS.connect({ url: `nats://${url}:${port}`, json: jsonMode });

    instance.on('error', (err) => {
      // exit process
      debug('nats connection errored', err);
      process.exit(1);
    });

    instance.on('disconnect', () => {
      // exit process
      debug('nats connection disconnected');
      process.exit(1);
    });

    instance.on('close', () => {
      // exit process
      debug('nats connection closed');
      process.exit(1);
    });

    return instance;
  }
  return instance;
};
