const debug = require('debug')('feathers-mq:server:a');
const NATS = require('nats');
const Errors = require('@feathersjs/errors');

module.exports = function getFn(params = {}) {
  return function subscribeNats() {
    const app = this;
    const host = params.host || 'localhost';
    const port = params.ports || 4222;

    if (!app.get('name')) {
      throw new Errors.BadRequest('App name is required');
    }

    const nats = NATS.connect(`nats://${host}:${port}`);


    // TODO: vanessa - transfer adding listeners inside subscribe callbacks
    // upon implementing pure API gateway backend (no actual services),
    // so that we can configure mq-server before configuring services in app
    if (app.services && Object.keys(app.services) && Object.keys(app.services).length) {
      const serviceNames = Object.keys(app.services);
      serviceNames.forEach((serviceName) => {
        app.service(serviceName).on('created', data => nats.publish(`${app.get('name')}.${serviceName}.created.events`, JSON.stringify(data)));
        app.service(serviceName).on('patched', data => nats.publish(`${app.get('name')}.${serviceName}.patched.events`, JSON.stringify(data)));
        app.service(serviceName).on('updated', data => nats.publish(`${app.get('name')}.${serviceName}.updated.events`, JSON.stringify(data)));
        app.service(serviceName).on('removed', data => nats.publish(`${app.get('name')}.${serviceName}.removed.events`, JSON.stringify(data)));
      });
    }

    debug(`Connected to NATS on ${host}:${port} and listening for ${app.get('name')}.*`);

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

    nats.on('error', (err) => {
      // exit process
      debug('nats connection errored', err);
      process.exit(1);
    });

    nats.on('disconnect', () => {
      // exit process
      debug('nats connection disconnected');
      process.exit(1);
    });

    nats.on('close', () => {
      // exit process
      debug('nats connection closed');
      process.exit(1);
    });

    app.mq = { subs: nats.subs };
  };
};
