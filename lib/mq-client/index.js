const debug = require('debug')('feathers-mq:client:');
const Errors = require('@feathersjs/errors');
const getInstance = require('../instance');
const service = require('./service');

module.exports = function getFn(natsConfig) {
  const nats = getInstance(natsConfig);

  return function attachService() {
    const app = this;

    if (!app.get('name')) {
      throw new Errors.BadRequest('App name is required');
    }

    debug(`Connected to NATS as Client : ${app.get('name')}.*`);

    app.service = service.bind({ nats, app });
  };
};
