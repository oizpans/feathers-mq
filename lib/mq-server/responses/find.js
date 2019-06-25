const debug = require('debug')('feathers-mq:server:find');
const Errors = require('@feathersjs/errors');
const wrapError = require('../wrap-error');

module.exports = async function find(request, replyTo, subject) {
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
    const result = await app.service(serviceName).find(request.params);
    return nats.publish(replyTo, result);
  } catch (err) {
    delete err.hook;
    return nats.publish(replyTo, wrapError(err));
  }
};
