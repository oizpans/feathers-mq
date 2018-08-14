const debug = require('debug')('nats-instance:');
const Errors = require('@feathersjs/errors');
const NATS = require('nats');

let instance = null;

module.exports = function getInstance(natsConfig = {}) {
  const url = natsConfig.url || 'localhost';
  const port = natsConfig.port || 4222;
  const jsonMode = natsConfig.json || true;

  if (!instance) {
    instance = NATS.connect({ url: `nats://${url}:${port}`, json: jsonMode });

    instance.on('error', (err) => {
      debug('nats connection errored', err);
      throw new Errors.BadRequest('NATS connection error');
    });

    instance.on('disconnect', () => {
      debug('nats connection disconnected');
      throw new Errors.BadRequest('NATS connection has been disconnected');
    });

    instance.on('close', () => {
      debug('nats connection closed');
      throw new Errors.BadRequest('NATS connection has been closed');
    });

    return instance;
  }

  return instance;
};
