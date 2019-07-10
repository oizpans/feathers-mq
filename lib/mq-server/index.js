const debug = require('debug')('feathers-mq:server:a');
const Errors = require('@feathersjs/errors');

const getInstance = require('../instance');
const responses = require('./responses');

let nats = null;

module.exports = function MQServer(natsConfig) {
  nats = getInstance(natsConfig);

  return function mqserver() {
    const app = this;

    if (!app.get('name')) {
      throw new Errors.BadRequest('App name is required');
    }

    responses({ app, nats });

    nats.on('connect', () => {
      debug('NATS SERVER connected : %O', app.get('name'));
    });

    nats.on('reconnect', () => {
      debug('NATS SERVER reconnected : %O', app.get('name'));
    });

    nats.on('error', (err) => {
      debug('NATS SERVER connection errored', err);
    });

    nats.on('disconnect', () => {
      debug('NATS SERVER disconnected');
    });

    nats.on('close', () => {
      debug('nats connection closed');
      throw new Errors.BadRequest('NATS SERVER closed');
    });

    nats.on('reconnecting', () => {
      debug('NATS SERVER reconnecting');
    });

    app.set('natServerInstance', nats);

    app.mq = {
      subs: nats.subs,
    };
  };
};
