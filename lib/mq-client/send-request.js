const debug = require('debug')('feathers-mq:client:send-request');
const info = require('debug')('feathers-mq:info');
const NATS = require('nats');
const Errors = require('@feathersjs/errors');

module.exports = function sendRequest(params) {
  const { nats, app, serviceName } = this;

  const appName = app.get('name');
  const configuration = app.get('natsConfig');

  const { method: methodName, request } = params;

  const { $rpcType = true } = request.params;

  debug(`rpcType request: ${$rpcType}`);
  delete request.params.$rpcType;

  debug('triggered %O', { serviceName, methodName });

  const payload = Object.assign({}, request, { app: appName });

  return new Promise(async (resolve, reject) => {
    if (!$rpcType) {
      info('none rpcType request');
      nats.publish(`${serviceName}.${methodName}`, payload);
      resolve();
      return;
    }

    nats.requestOne(`${serviceName}.${methodName}`, payload, null, configuration.timeout, (response) => {
      if (response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
        debug('got timeout by calling %O.%O', serviceName, methodName);

        return reject(
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
          return reject(response.__mqError);
        }

        if (response.errors) {
          return reject(response);
        }
      }

      return resolve(response);
    });
  });
};
