const debug = require('debug')('feathers-mq:client:send-request');
const NATS = require('nats');
const Errors = require('@feathersjs/errors');

module.exports = function sendRequest(params) {
  const {
    method: methodName,
    request,
    name: serviceName,
    nats,
    appName,
  } = params;

  const { $rpcType = true } = request.params;

  debug(`request in rpcType: ${$rpcType}`);
  delete request.params.$rpcType;

  const payload = Object.assign({}, request, { app: appName });

  return new Promise(async (resolve, reject) => {
    if (!$rpcType) {
      nats.publish(`${serviceName}.${methodName}`, payload);
      resolve();
      return;
    }

    try {
      nats.requestOne(`${serviceName}.${methodName}`, payload, {}, 2000, (response) => {
        if (response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
          reject(new Errors.BadRequest('Request timed out.'));
        }
        debug(`Got response ${response} on NATS for ${serviceName}.${methodName}`);
        const finalResponse = typeof response === 'string' ? JSON.parse(response) : response;
        if (finalResponse.errors) {
          reject(finalResponse);
        }
        resolve(finalResponse);
      });
    } catch (e) {
      reject(e);
    }
  });
};
