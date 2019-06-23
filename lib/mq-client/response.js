const debug = require('debug')('feathers-mq:client:response');
const NATS = require('nats');
const Errors = require('@feathersjs/errors');

module.exports = function responseHandler(response) {
  const { appName, serviceName, methodName } = this;

  if (response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
    debug('got timeout by calling %O.%O', serviceName, methodName);

    return Promise.reject(
      new Errors.Timeout('Request timed out on feathers-mq.', {
        appName,
        serviceName,
        methodName,
      }),
    );
  }

  debug('Got response %O', response);

  if (response) {
    if (response.__mqError) {
      return Promise.reject(response.__mqError);
    }

    if (response.errors) {
      return Promise.reject(response);
    }
  }

  return Promise.resolve(response);
};
