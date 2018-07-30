const debug = require('debug')('feathers-mq:server:a');
const Errors = require('@feathersjs/errors');

module.exports = async function patch(request, res, subject) {
  const { nats, app } = this;
  const [, serviceName, methodName] = subject.split('.');
  debug(`${methodName} request for ${app.get('name')}.${serviceName}`);
  const req = JSON.parse(request);

  // check if service is registered
  if (!Object.keys(app.services).includes(serviceName)) {
    const errorResponse = new Errors.NotFound();
    return nats.publish(res, JSON.stringify(errorResponse));
  }

  // check if the 'service method' is registered
  if (!Object.keys(app.service(serviceName)).includes(methodName)) {
    const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
    return nats.publish(res, JSON.stringify(errorResponse));
  }

  try {
    const result = await app.service(serviceName).patch(req.id, req.data, req.params);
    return nats.publish(res, JSON.stringify(result));
  } catch (err) {
    return nats.publish(res, JSON.stringify(err));
  }
};
