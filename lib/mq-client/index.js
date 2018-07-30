const debug = require('debug')('feathers-mq:client:');
const NATS = require('nats');
const Errors = require('@feathersjs/errors');
const getInstance = require('../instance');

let nats = null;

module.exports = function getFn(natsConfig) {
  nats = getInstance(natsConfig);

  return function attachService() {
    const app = this;

    const appName = app.get('name');

    if (!appName) {
      throw new Errors.BadRequest('App name is required');
    }

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

    debug(`Connected to NATS as Client : ${app.get('name')}.*`);

    app.service = function natsService(name) {
      let finalName = name;

      if (name.startsWith('/')) {
        finalName = name.replace('/', '');
      }

      if (app.services && app.services[finalName]) {
        debug('local service ', finalName);
        return app.services[finalName];
      }

      const sendRequest = function natsRequest(method, request) {
        const { $rpcType = true } = request.params;

        debug('request in rpcType ', $rpcType);
        delete request.params.$rpcType;

        const payload = Object.assign({}, request, { app: appName });

        return new Promise(async (resolve, reject) => {
          if (!$rpcType) {
            console.log(name);
            nats.publish(`${name}.${method}`, payload);
            resolve();
            return;
          }

          try {
            nats.requestOne(`${name}.${method}`, payload, {}, 2000, (response) => {
              if (response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
                reject(new Errors.BadRequest('Request timed out.'));
              }
              debug(`Got response ${response} on NATS for ${name}.${method}`);
              const finalResponse = typeof response === 'string' ? JSON.parse(response) : response;
              if (finalResponse.errors) {
                reject(finalResponse);
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

        // on(evt, cb) {
        //   return nats.subscribe(`${name}.${evt}.events`, async (request) => {
        //     await cb(JSON.parse(request));
        //   });
        // },
      };
    };
  };
};
