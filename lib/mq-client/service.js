const debug = require('debug')('feathers-mq:client:service:');
const sendRequest = require('./send-request');

module.exports = function natsService(serviceName) {
  const { nats, app } = this;
  const appName = app.get('serviceName');

  let finalName = serviceName;

  if (serviceName.startsWith('/')) {
    finalName = serviceName.replace('/', '');
  }

  if (app.services[finalName]) {
    debug(`local service: ${finalName}`);
    return app.services[finalName];
  }

  // service methods
  return {
    find(params = {}) {
      const method = 'find';
      const request = {
        params,
      };

      return sendRequest({
        nats,
        serviceName,
        method,
        request,
        appName,
      });
    },

    get(id, params = {}) {
      const method = 'get';
      const request = {
        id,
        params,
      };
      return sendRequest({
        nats,
        serviceName,
        method,
        request,
        appName,
      });
    },

    create(data = {}, params = {}) {
      const method = 'create';
      const request = {
        data,
        params,
      };
      return sendRequest({
        nats,
        serviceName,
        method,
        request,
        appName,
      });
    },

    update(id, data = {}, params = {}) {
      const method = 'update';
      const request = {
        id,
        data,
        params,
      };
      return sendRequest({
        nats,
        serviceName,
        method,
        request,
        appName,
      });
    },

    patch(id, data = {}, params = {}) {
      const method = 'patch';
      const request = {
        id,
        data,
        params,
      };

      return sendRequest({
        nats,
        serviceName,
        method,
        request,
        appName,
      });
    },

    remove(id, params = {}) {
      const method = 'remove';
      const request = {
        id,
        params,
      };

      return sendRequest({
        nats,
        serviceName,
        method,
        request,
        appName,
      });
    },

  };
};
