const feathers = require('@feathersjs/feathers');
const mongoose = require('mongoose');
const services = require('./services');

const { Server } = require('../../../lib');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/feathers-mq-test');

const app = feathers();

app.set('name', 'ServerAppName');

app.configure(Server());
app.configure(services);

module.exports = app;
