const debug = require('debug')('feathers-mq:server:a');
const Errors = require('@feathersjs/errors');

module.exports = async function create(request, replyTo, subject) {
  const { nats, app } = this;

  const [, serviceName, methodName] = subject.split('.');

  debug(`${methodName} request for ${app.get('name')}.${serviceName}`);

  // check if service is registered
  if (!Object.keys(app.services).includes(serviceName)) {
    const errorResponse = new Errors.NotFound();
    if (replyTo) {
      return nats.publish(replyTo, errorResponse);
    }
    return 0;
  }

  // check if the 'service method' is registered
  if (!Object.keys(app.service(serviceName)).includes(methodName)) {
    const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
    if (replyTo) {
      return nats.publish(replyTo, errorResponse);
    }
    return 0;
  }

  try {
    if (replyTo) {
      const result = await app.service(serviceName).create(request.data, request.params);
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
