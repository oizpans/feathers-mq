const debug = require('debug')('feathers-mq:server:index');
const Errors = require('@feathersjs/errors');

const getInstance = require('../instance');
const responses = require('./responses');

let nats = null;

module.exports = function MQServer(options) {
  const { natsConfig, microServices } = options;
  nats = getInstance(natsConfig);

  return function mqserver() {
    const app = this;

    if (!app.get('name')) {
      throw new Errors.BadRequest('App name is required');
    }

    responses({ app, nats, microServices });

    debug('nats server connected');

    app.set('natsServer', nats);

    app.mq = {
      subs: nats.subs,
    };
  };
};
