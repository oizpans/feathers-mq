const debug = require('debug')('feathers-mq:server:index');
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
      debug(`Connected to NATS as Server : ${app.get('name')}.*`);
    });

    nats.on('error', (err) => {
      // exit process
      debug('nats connection errored', err);
    });

    nats.on('disconnect', () => {
      // exit process
      debug('nats connection disconnected');
    });

    nats.on('close', () => {
      // exit process
      debug('nats connection closed');
      process.exit(1);
    });

    app.set('natsInstance', nats);

    app.mq = {
      subs: nats.subs,
    };
  };
};
