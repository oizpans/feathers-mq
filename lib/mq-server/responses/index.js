const createHandler = require('./create');
const findHandler = require('./find');
const getHandler = require('./get');
const patchHandler = require('./patch');
const updateHandler = require('./update');
const removeHandler = require('./remove');

module.exports = function response({ app, nats }) {
  const handlerScope = {
    nats,
    app,
  };

  const appName = app.get('name');
  const serviceName = app.get('serviceName') || '*';

  // FIND event and handler
  nats.subscribe(`${appName}.${serviceName}.find`, { queue: `${appName}.${serviceName}.find` }, findHandler.bind(handlerScope));

  // GET event and handler
  nats.subscribe(`${appName}.${serviceName}.get`, { queue: `${appName}.${serviceName}.get` }, getHandler.bind(handlerScope));

  // CREATE event and handler
  nats.subscribe(`${appName}.${serviceName}.create`, { queue: `${appName}.${serviceName}.create` }, createHandler.bind(handlerScope));

  // PATCH event and handler
  nats.subscribe(`${appName}.${serviceName}.patch`, { queue: `${appName}.${serviceName}.patch` }, patchHandler.bind(handlerScope));

  // UPDATE event and handler
  nats.subscribe(`${appName}.${serviceName}.update`, { queue: `${appName}.${serviceName}.update` }, updateHandler.bind(handlerScope));

  // REMOVE event and handler
  nats.subscribe(`${appName}.${serviceName}.remove`, { queue: `${appName}.${serviceName}.remove` }, removeHandler.bind(handlerScope));
};
