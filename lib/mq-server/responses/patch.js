const debug = require('debug')('feathers-mq:server:patch');
const Errors = require('@feathersjs/errors');
const wrapError = require('../wrap-error');

module.exports = async function patch(request, replyTo, subject) {
  const { nats, app } = this;
  const [, serviceName, methodName] = subject.split('.');
  debug(`${methodName} request for ${app.get('name')}.${serviceName}`);

  const Services = Object.keys(app.services);

  // check if service is registered
  if (!Services.includes(serviceName)) {
    const errorResponse = new Errors.NotFound();
    debug('error response %O', errorResponse);
    if (replyTo) {
      return nats.publish(replyTo, errorResponse);
    }
    return 0;
  }

  const availableMethods = Object.keys(app.services[serviceName]);

  // check if the 'service method' is registered
  if (!availableMethods.includes(methodName)) {
    const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
    debug('error response %O', errorResponse);
    if (replyTo) {
      return nats.publish(replyTo, errorResponse);
    }
    return 0;
  }

  try {
    const result = await app.service(serviceName).patch(request.id, request.data, request.params);

    if (replyTo) {
      return nats.publish(replyTo, result);
    }
    return 0;
  } catch (err) {
    delete err.hook;
    if (replyTo) {
      return nats.publish(replyTo, wrapError(err));
    }
    return 0;
  }
};
