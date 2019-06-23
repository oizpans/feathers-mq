const debug = require('debug')('feathers-mq:instance');
const Errors = require('@feathersjs/errors');
const NATS = require('nats');

let instance = null;

module.exports = function getInstance(natsConfig = {}) {
  const url = natsConfig.url || 'localhost';
  const port = natsConfig.port || 4222;
  const jsonMode = natsConfig.json || true;
  const maxPingOut = natsConfig.maxPingOut || 2;
  const maxReconnectAttempts = natsConfig.maxReconnectAttempts || 10;
  const reconnectTimeWait = natsConfig.reconnectTimeWait || 2000;
  const reconnect = natsConfig.reconnect || true;

  if (!instance) {
    instance = NATS.connect({
      url: `nats://${url}:${port}`,
      json: jsonMode,
      verbose: true,
      maxPingOut,
      maxReconnectAttempts,
      reconnectTimeWait,
      reconnect,
    });

    instance.on('error', (err) => {
      debug('nats connection errored', err);
      throw new Errors.BadRequest('NATS connection error', { error: err });
    });

    instance.on('disconnect', () => {
      debug('nats connection disconnected');
      // throw new Errors.BadRequest('NATS connection has been disconnected');
    });

    instance.on('close', () => {
      debug('nats connection closed');
      throw new Errors.BadRequest('NATS connection has been closed');
    });

    instance.on('reconnecting', (...all) => {
      console.log(all.length);
      debug('nats reconnecting');
    });

    instance.on('reconnect', () => {
      debug('Reconnected as NATS instance');
    });


    return instance;
  }

  return instance;
};
