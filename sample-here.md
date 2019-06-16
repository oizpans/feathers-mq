# Sample Usage

### Server:
```js
const feathers = require('@feathersjs/feathers');
const mongoose = require('mongoose');
const services = require('./services');

const { Server } = require('feathers-mq');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/my-db');

const app = feathers();

// set the name of app - required
app.set('name', 'ServerName');

// services must be configured first before feathers-mq server if we want to add listeners to the services on mq
app.configure(services);

// setup mq transport for server
app.configure(Server({
  url: 'localhost', // hostname for NATS - optional (defaults to `localhost`)
  port: 4222, // port(s) for NATS - optional (defaults to 4222)
}));

module.exports = app;
```

### Client:
```js
const feathers = require('@feathersjs/feathers');
const { Client } = require('feathers-mq');

const app = feathers();

// set the name of app - required
app.set('name', 'ClientName');

// setup mq transport for client
app.configure(Client({
  url: 'localhost', // hostname for NATS - optional (defaults to `localhost`)
  port: 4222, // port(s) for NATS - optional (defaults to 4222)
  timeout: 3000, // in ms, timeout for NATS - optional (defaults to 5000)
}));

(async () => {
  // use `${serverAppName}.${serviceName}` as parameter to app.service

  // call `create` method on `products` service of mq-server app with name `ServerName`
  await app.service('ServerName.products').create({
    name: 'Rice',
    price: 'Php 12',
  });
  const products = await app.service('ServerName.products').find({});

  console.log('Products: ', products);

})();
```
[< Back](./README.md)
