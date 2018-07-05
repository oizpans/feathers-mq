const feathers = require('@feathersjs/feathers');
const { Client } = require('../../../lib');

const app = feathers();

app.set('name', 'ClientAppName');

app.configure(Client());

module.exports = app;
