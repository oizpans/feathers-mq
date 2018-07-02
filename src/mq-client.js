const debug = require('debug')('feathers-mq:client:a');
const NATS = require('nats');

module.exports = function (params = {}) {

  return async function() {
    const app = this;
    const host = params.host || 'localhost';
    const port = params.ports || 4222;

    if (!app.get('name')) {
    throw new Error('App name is required');
    }

    const nats = NATS.connect(`nats://${host}:${port}`);

    debug(`Connected to NATS on ${host}:${port} and requestnig from ${app.get('name')}.*`);


    app.service = function (name) {

      if (app.services.hasOwnProperty(name)) {
        return app.services[name];
        console.log("this is a local service")
      }

      const _request = function (method, request) {
        return new Promise(async (resolve, reject) => {
          try {
            nats.requestOne(`${name}.${method}`, JSON.stringify(request), {}, 2000, function(response) {
              if(response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) { reject('Request timed out.'); }
              debug(`Got response ${response} on NATS for ${name}.${method}`)
              response = JSON.parse(response);
              if (response.errors) {
                reject(response);
              }
              resolve(response);
              });
           } catch (e) {
             reject(e);
           }
        });
      }

      return {
        find (params = {}) {
          // debug("Find was requested")
          const method = 'find';
          const request = {
            params,
          };
          return _request(method, request);
        },

        get(id, params = {}) {
          const method = 'get';
          const request = {
            id,
            params,
          };
          return _request(method, request);
        },

        create(data = {}, params = {}) {
          const method = 'create';
          const request = {
            data,
            params,
          };
          return _request(method, request);
        },

        update(id, data, params) {},

        patch(id, data, params = {}) {
          const method = 'patch';
          const request = {
            id,
            data,
            params,
          };
          return _request(method, request);
        },

        remove(id, params) {},
        setup(app, path) {}


      }
    }

    debug("feathers mq client ran");

  }

}
