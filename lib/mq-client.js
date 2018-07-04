const debug = require('debug')('feathers-mq:client:a');
const NATS = require('nats');

module.exports = function getFn(options = {}) {
  return async function attachService() {
    const app = this;
    const host = options.host || 'localhost';
    const port = options.ports || 4222;

    if (!app.get('name')) {
      throw new Error('App name is required');
    }

    const nats = NATS.connect(`nats://${host}:${port}`);

    debug(`Connected to NATS on ${host}:${port} and requesting from ${app.get('name')}.*`);

    app.service = function setupService(name) {
      if (app.services && app.services[name]) {
        debug('this is a local service');
        return app.services[name];
      }

      const sendRequest = function natsRequest(method, request) {
        return new Promise(async (resolve, reject) => {
          try {
            nats.requestOne(`${name}.${method}`, JSON.stringify(request), {}, 2000, (response) => {
              if (response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
                reject(new Error('Request timed out.'));
                return;
              }
              debug(`Got response ${response} on NATS for ${name}.${method}`);
              const finalResponse = typeof response === 'string' ? JSON.parse(response) : response;
              if (finalResponse.errors) {
                reject(finalResponse);
                return;
              }
              resolve(finalResponse);
            });
          } catch (e) {
            reject(e);
          }
        });
      };

      return {
        find(params = {}) {
          // debug("Find was requested")
          const method = 'find';
          const request = {
            params,
          };
          return sendRequest(method, request);
        },

        get(id, params = {}) {
          const method = 'get';
          const request = {
            id,
            params,
          };
          return sendRequest(method, request);
        },

        create(data = {}, params = {}) {
          const method = 'create';
          const request = {
            data,
            params,
          };
          return sendRequest(method, request);
        },

        update(id, data = {}, params = {}) {
          const method = 'update';
          const request = {
            id,
            data,
            params,
          };
          return sendRequest(method, request);
        },

        patch(id, data = {}, params = {}) {
          const method = 'patch';
          const request = {
            id,
            data,
            params,
          };
          return sendRequest(method, request);
        },

        remove(id, params = {}) {
          const method = 'remove';
          const request = {
            id,
            params,
          };
          return sendRequest(method, request);
        },
      };
    };

    debug('feathers mq client ran');
  };
};
