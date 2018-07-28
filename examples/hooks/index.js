const feathers = require('@feathersjs/feathers');
const mongoose = require('mongoose');
const services = require('./services');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/feathers-mq', { useNewUrlParser: true });

const app = feathers();

app.set('appName', 'ServerProjectName');

app.configure(services);

(async function run() {
  await app.service('products').create({
    name: 'anotherr',
    price: 11,
  });

  await app.service('products').find();

  // app.service('categories').create({
  //   name: 'beer',
  // });
}());

console.log('running server instance');
