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

    debug('nats server connected');

    app.set('natsInstance', nats);

    app.mq = {
      subs: nats.subs,
    };
  };
};
