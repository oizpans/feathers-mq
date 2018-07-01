const debug = require('debug')('feathers-mq:server:a');
const NATS = require('nats');
const Errors = require('@feathersjs/errors');

module.exports = function (params = {}) {

  return async function() {
    const app = this;
    const host = params.host || 'localhost';
    const port = params.ports || 4222;

    if (!app.get('name')) {
      throw new Error('App name is required');
    }

    const nats = NATS.connect(`nats://${host}:${port}`);

    debug(`Connected to NATS on ${host}:${port} and listening for ${app.get('name')}.*`);

    // handling find method
    nats.subscribe(`${app.get('name')}.*.find`, function(request, res, subject) {
      const [,serviceName, methodName ] = subject.split('.');
      debug(`${methodName} request for ${app.get('name')}.${serviceName}`);
      const req = JSON.parse(request);

      // check if service is registered
      if(!Object.keys(app.services).includes(serviceName)){
        const errorResponse = new Errors.NotFound();
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      // check if the 'service method' is registered
      if(!Object.keys(app.service(serviceName)).includes(methodName)){
        const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      app.service(serviceName).find(req.params)
        .then((result) => {
          nats.publish(res, JSON.stringify(result));
        }).catch(function(err){
          nats.publish(res, JSON.stringify(err));
        });
    });

    // handling get method
    nats.subscribe(`${app.get('name')}.*.get`, function(request, res, subject) {
      const [,serviceName, methodName ] = subject.split('.');
      debug(`${methodName} request for ${app.get('name')}.${serviceName}`);
      const req = JSON.parse(request);

      // check if service is registered
      if(!Object.keys(app.services).includes(serviceName)){
        const errorResponse = new Errors.NotFound();
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      // check if the 'service method' is registered
      if(!Object.keys(app.service(serviceName)).includes(methodName)){
        const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      app.service(serviceName).get(req.id, req.params)
        .then((result) => {
          nats.publish(res, JSON.stringify(result));
        }).catch(function(err){
          nats.publish(res, JSON.stringify(err));
        });
    });

    // handling create method
    nats.subscribe(`${app.get('name')}.*.create`, function(request, res, subject) {
      const [,serviceName, methodName ] = subject.split('.');
      debug(`${methodName} request for ${app.get('name')}.${serviceName}`);
      const req = JSON.parse(request);

      // check if service is registered
      if(!Object.keys(app.services).includes(serviceName)){
        const errorResponse = new Errors.NotFound();
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      // check if the 'service method' is registered
      if(!Object.keys(app.service(serviceName)).includes(methodName)){
        const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      app.service(serviceName).create(req.data, req.params)
        .then((result) => {
          nats.publish(res, JSON.stringify(result));
        }).catch(function(err){
          nats.publish(res, JSON.stringify(err));
        });
    });

    // handling patch method
    nats.subscribe(`${app.get('name')}.*.patch`, function(request, res, subject) {
      const [,serviceName, methodName ] = subject.split('.');
      debug(`${methodName} request for ${app.get('name')}.${serviceName}`);
      const req = JSON.parse(request);

      // check if service is registered
      if(!Object.keys(app.services).includes(serviceName)){
        const errorResponse = new Errors.NotFound();
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      // check if the 'service method' is registered
      if(!Object.keys(app.service(serviceName)).includes(methodName)){
        const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      app.service(serviceName).patch(req.id, req.data, req.params)
        .then((result) => {
          nats.publish(res, JSON.stringify(result));
        }).catch(function(err){
          console.log(err)
          nats.publish(res, JSON.stringify(err));
        });
    });

    // handling update method
    nats.subscribe(`${app.get('name')}.*.update`, function(request, res, subject) {
      const [,serviceName, methodName ] = subject.split('.');
      debug(`${methodName} request for ${app.get('name')}.${serviceName}`);
      const req = JSON.parse(request);

      // check if service is registered
      if(!Object.keys(app.services).includes(serviceName)){
        const errorResponse = new Errors.NotFound();
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      // check if the 'service method' is registered
      if(!Object.keys(app.service(serviceName)).includes(methodName)){
        const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      app.service(serviceName).update(req.id, req.data, req.params)
        .then((result) => {
          nats.publish(res, JSON.stringify(result));
        }).catch(function(err){
          nats.publish(res, JSON.stringify(err));
        });

    });

    // handling remove method
    nats.subscribe(`${app.get('name')}.*.remove`, function(request, res, subject) {
      const [,serviceName, methodName ] = subject.split('.');
      debug(`${methodName} request for ${app.get('name')}.${serviceName}`);
      const req = JSON.parse(request);

      // check if service is registered
      if(!Object.keys(app.services).includes(serviceName)){
        const errorResponse = new Errors.NotFound();
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      // check if the 'service method' is registered
      if(!Object.keys(app.service(serviceName)).includes(methodName)){
        const errorResponse = new Errors.MethodNotAllowed(`Method \`${methodName}\` is not supported by this endpoint.`);
        return nats.publish(res, JSON.stringify(errorResponse));
      }

      app.service(serviceName).remove(req.id, req.params)
        .then((result) => {
          nats.publish(res, JSON.stringify(result));
        }).catch(function(err){
          nats.publish(res, JSON.stringify(err));
        });
    });

    nats.on('error', (err) => {
      // exit process
      console.log('nats connection errored', err);
      process.exit(1);
    });

    nats.on('disconnect', () => {
      // exit process
      console.log('nats connection disconnected');
      process.exit(1);
    });

    nats.on('close', () => {
      // exit process
      console.log('nats connection closed');
      process.exit(1);
  });


  }
}
