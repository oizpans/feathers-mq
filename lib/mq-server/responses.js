const debug = require('debug')('feathers-mq:server:a');
const Errors = require('@feathersjs/errors');

module.exports = function response({ app, nats }) {
  // handling find method
  nats.subscribe(`${app.get('name')}.*.find`, async (request, res, subject) => {
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
      const result = await app.service(serviceName).find(req.params);
      return nats.publish(res, JSON.stringify(result));
    } catch (err) {
      return nats.publish(res, JSON.stringify(err));
    }
  });

  // handling get method
  nats.subscribe(`${app.get('name')}.*.get`, async (request, res, subject) => {
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
      const result = await app.service(serviceName).get(req.id, req.params);
      return nats.publish(res, JSON.stringify(result));
    } catch (err) {
      return nats.publish(res, JSON.stringify(err));
    }
  });

  // handling create method
  nats.subscribe(`${app.get('name')}.*.create`, async (request, res, subject) => {
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
      const result = await app.service(serviceName).create(req.data, req.params);
      return nats.publish(res, JSON.stringify(result));
    } catch (err) {
      return nats.publish(res, JSON.stringify(err));
    }
  });

  // handling patch method
  nats.subscribe(`${app.get('name')}.*.patch`, async (request, res, subject) => {
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
  });

  // handling update method
  nats.subscribe(`${app.get('name')}.*.update`, async (request, res, subject) => {
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
      const result = await app.service(serviceName).update(req.id, req.data, req.params);
      return nats.publish(res, JSON.stringify(result));
    } catch (err) {
      return nats.publish(res, JSON.stringify(err));
    }
  });

  // handling remove method
  nats.subscribe(`${app.get('name')}.*.remove`, async (request, res, subject) => {
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
      const result = await app.service(serviceName).remove(req.id, req.params);
      return nats.publish(res, JSON.stringify(result));
    } catch (err) {
      return nats.publish(res, JSON.stringify(err));
    }
  });
};
