const feathers = require('@feathersjs/feathers');
const mongoose = require('mongoose');
const services = require('./services');
const { Client } = require('../../lib');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/micro-logger_local', { useNewUrlParser: true });

const app = feathers();

app.set('name', 'any_app');

app.configure(services);
app.configure(Client());

(async function run() {
  await app.service('products').create({
    name: 'another',
    price: 11,
  });
}());

console.log('running server instance');
