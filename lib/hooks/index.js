const debug = require('debug')('feathers-mq:hook:');
const Errors = require('@feathersjs/errors');

const deniedMethods = ['find', 'get'];

module.exports = function Logger() {
  return function logger(context) {
    const appName = context.app.get('name');

    if (!appName) {
      throw new Errors.BadRequest('App name is required');
    }

    if (deniedMethods.includes(context.method)) {
      debug('denied method ', context.method);
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

    context.app.service('logger.logs').create(logData, { $rpcType: false });

    return context;
  };
};
