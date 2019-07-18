const debug = require('debug')('feathers-mq:client:index');
const Errors = require('@feathersjs/errors');
const getInstance = require('../instance');
const service = require('./service');

module.exports = function getFn(natsConfig = {}) {
  const nats = getInstance(natsConfig);
  const configuration = Object.assign({}, natsConfig);
  configuration.timeout = natsConfig.timeout || 5000;

  return function attachService() {
    const app = this;

    if (!app.get('name')) {
      throw new Errors.BadRequest('App name is required');
    }

    debug(`Connected to NATS as Client : ${app.get('name')}.*`);

    app.set('natsInstance', nats);
    app.set('natsConfig', configuration);

    app.service = service.bind({ nats, app });
  };
};
