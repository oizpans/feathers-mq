const createHandler = require('./create');
const findHandler = require('./find');
const getHandler = require('./get');
const patchHandler = require('./patch');
const updateHandler = require('./update');
const removeHandler = require('./update');

module.exports = function response({ app, nats }) {
  const handlerScope = {
    nats,
    app,
  };

  const appName = app.get('name');

  // FIND event and handler
  nats.subscribe(`${appName}.*.find`, findHandler.bind(handlerScope));

  // GET event and handler
  nats.subscribe(`${appName}.*.get`, getHandler.bind(handlerScope));

  // CREATE event and handler
  nats.subscribe(`${appName}.*.create`, createHandler.bind(handlerScope));

  // PATCH event and handler
  nats.subscribe(`${appName}.*.patch`, patchHandler.bind(handlerScope));

  // UPDATE event and handler
  nats.subscribe(`${appName}.*.update`, updateHandler.bind(handlerScope));

  // REMOVE event and handler
  nats.subscribe(`${appName}.*.remove`, removeHandler.bind(handlerScope));
};
