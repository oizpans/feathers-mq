const feathers = require('@feathersjs/feathers');
const mongoose = require('mongoose');
const services = require('./services');

const { Server } = require('../../lib');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/feathers-mq', { useNewUrlParser: true });

const app = feathers();

app.set('name', 'ServerProjectName');

app.configure(services);
app.configure(Server());

console.log('running instance with appName:', app.get('name'));
