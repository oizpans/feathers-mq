const debug = require('debug')('feathers-mq:client:send-request');
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

  debug(`triggered ${serviceName}.${methodName}`);

  const payload = Object.assign({}, request, { app: appName });

  return new Promise(async (resolve, reject) => {
    if (!$rpcType) {
      nats.publish(`${serviceName}.${methodName}`, payload);
      resolve();
      return;
    }

    try {
      nats.requestOne(`${serviceName}.${methodName}`, payload, {}, configuration.timeout, (response) => {
        if (response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
          return reject(new Errors.Timeout('Request timed out on feathers-mq.', {
            appName,
            serviceName,
            methodName,
          }));
        }
        debug('Got response %O', response);

        if (response) {
          if (response.__mqError) { //eslint-disable-line
            return reject(response.__mqError);  //eslint-disable-line
          }

          if (response.errors) {
            return reject(response);
          }
        }

        return resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });
};
