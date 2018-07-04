const feathers = require('@feathersjs/feathers');
const mongoose = require('mongoose');
const services = require('./services');

const { Server } = require('../../lib');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/feathers-mq');

const app = feathers();

app.set('name', 'ServerProjectName');

app.configure(Server());
app.configure(services);

console.log('running server instance');
