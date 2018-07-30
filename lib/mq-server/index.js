const debug = require('debug')('feathers-mq:server:a');
const NATS = require('nats');
const Errors = require('@feathersjs/errors');

const responses = require('./responses');

let nats = null;

module.exports = function MQServer(params = {}) {
  if (!nats) {
    const host = params.host || 'localhost';
    const port = params.ports || 4222;
    nats = NATS.connect({ url: `nats://${host}:${port}`, json: true });
    debug(`Connected to NATS on ${host}:${port} and listening`);
  }

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
      process.exit(1);
    });

    nats.on('disconnect', () => {
      // exit process
      debug('nats connection disconnected');
      process.exit(1);
    });

    nats.on('close', () => {
      // exit process
      debug('nats connection closed');
      process.exit(1);
    });

    app.mq = {
      subs: nats.subs,
    };
  };
};
