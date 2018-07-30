const debug = require('debug')('feathers-mq:hook:');
const Errors = require('@feathersjs/errors');
const getNats = require('../instance');

const deniedMethods = ['find', 'get'];

module.exports = function Logger() {
  const nats = getNats();

  return function logger(context) {
    const appName = context.app.get('name');

    if (!appName) {
      throw new Errors.BadRequest('App name is required');
    }

    const serviceName = context.path;
    const methodName = context.method;

    if (deniedMethods.includes(context.method)) {
      debug('denied method ', methodName);
      return context;
    }

    const logData = {
      result: context.result,
      method: context.method,
      service: context.path,
      data: context.data,
      params: context.params,
      type: context.type,
      app: appName,
    };

    const natsSubject = `${appName}.${serviceName}.${methodName}`;
    debug('triggered %O', natsSubject);
    nats.publish(natsSubject, logData);

    return context;
  };
};
