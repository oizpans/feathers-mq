const debug = require('debug')('feathers-mq:client:service:');
const sendRequest = require('./send-request');

module.exports = function natsService(serviceName) {
  const { nats, app } = this;

  let finalName = serviceName;

  if (serviceName.startsWith('/')) {
    finalName = serviceName.replace('/', '');
  }

  if (app.services[finalName]) {
    debug(`local service: ${finalName}`);
    return app.services[finalName];
  }

  const sendRequestScope = { nats, app, serviceName };

  // service methods
  return {
    id: '_id',
    find(params = {}) {
      const method = 'find';
      const request = {
        params,
      };

      return sendRequest.call(sendRequestScope, {
        method,
        request,
      });
    },

    get(id, params = {}) {
      const method = 'get';
      const request = {
        id,
        params,
      };
      return sendRequest.call(sendRequestScope, {
        method,
        request,
      });
    },

    create(data = {}, params = {}) {
      const method = 'create';
      const request = {
        data,
        params,
      };
      return sendRequest.call(sendRequestScope, {
        method,
        request,
      });
    },

    update(id, data = {}, params = {}) {
      const method = 'update';
      const request = {
        id,
        data,
        params,
      };
      return sendRequest.call(sendRequestScope, {
        method,
        request,
      });
    },

    patch(id, data = {}, params = {}) {
      const method = 'patch';
      const request = {
        id,
        data,
        params,
      };

      return sendRequest.call(sendRequestScope, {
        method,
        request,
      });
    },

    remove(id, params = {}) {
      const method = 'remove';
      const request = {
        id,
        params,
      };

      return sendRequest.call(sendRequestScope, {
        method,
        request,
      });
    },

  };
};
