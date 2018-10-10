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

    const splitAppName = app.get('name').split('_');
    const envName = splitAppName[splitAppName.length - 1];

    if (!(envName === 'local' || envName === 'dev' || envName === 'stage' || envName === 'prod')) {
      app.set('name', `${app.get('name')}_${process.env.SETTINGS || 'local'}`);
    }

    debug(`Connected to NATS as Client : ${app.get('name')}.*`);

    app.set('natsInstance', nats);

    app.service = service.bind({ nats, app });
  };
};
