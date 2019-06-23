const debug = require('debug')('feathers-mq:client:send-request');
const info = require('debug')('feathers-mq:info');
const response = require('./response');

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

  return new Promise((resolve) => {
    if (!$rpcType) {
      info('none rpcType request');
      nats.publish(`${serviceName}.${methodName}`, payload);
      resolve();
      return;
    }

    nats.requestOne(`${serviceName}.${methodName}`, payload, null, configuration.timeout, response.bind({
      appName,
      serviceName,
      methodName,
    }));
  });
};
