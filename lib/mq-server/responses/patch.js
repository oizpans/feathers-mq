const debug = require('debug')('feathers-mq:server:a');
const Errors = require('@feathersjs/errors');

module.exports = async function patch(request, replyTo, subject) {
  const { nats, app } = this;
  const [, serviceName, methodName] = subject.split('.');
  debug(`${methodName} request for ${app.get('name')}.${serviceName}`);

  const Services = Object.keys(app.services);

  // check if service is registered
  if (!Services.includes(serviceName)) {
    const errorResponse = new Errors.NotFound();
    return nats.publish(replyTo, errorResponse);
  }

  // check if the 'service method' is registered
  if (!Services[serviceName].includes(methodName)) {
    const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
    return nats.publish(replyTo, errorResponse);
  }

  try {
    const result = await app.service(serviceName).patch(request.id, request.data, request.params);

    if (replyTo) {
      return nats.publish(replyTo, result);
    }
    return 0;
  } catch (err) {
    if (replyTo) {
      return nats.publish(replyTo, err);
    }
    return 0;
  }
};
