const debug = require('debug')('feathers-mq:nats-instance:');
const NATS = require('nats');

let instance = null;

module.exports = function getInstance(natsConfig = {}) {
  const url = natsConfig.url || 'localhost';
  const port = natsConfig.port || 4222;
  const jsonMode = natsConfig.json || true;

  if (!instance) {
    instance = NATS.connect({ url: `nats://${url}:${port}`, json: jsonMode });

    instance.on('connect', (nc) => {
      console.log(nc);
      console.log('connected');
    });

    instance.on('error', (err) => {
      debug('nats connection errored', err);
    });

    instance.on('disconnect', () => {
      debug('nats connection disconnected');
    });

    instance.on('close', () => {
      debug('nats connection closed');
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
