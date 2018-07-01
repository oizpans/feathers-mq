const feathers = require('@feathersjs/feathers');
const services = require('./services');
const { Server } = require('../../lib');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/feathers-mq');

const app = feathers();

app.set('name','ProjectName');

app.configure(Server());
app.configure(services);

console.log('running server instance');
