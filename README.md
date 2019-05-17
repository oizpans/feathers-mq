# feathers-mq
<img src="https://img.shields.io/github/tag/oizpans/feathers-mq.svg" /> <img src="https://img.shields.io/npm/v/@feathersjs/feathers.svg?label=@feathersjs/feathers" /> <img src="https://img.shields.io/npm/v/nats.svg?label=nats" />

FeathersJS message queue wrapper for the client and server.

## Requirements
* There must be a running NATS server at least on localhost port 4222 of the server where app resides

## Installation
```ssh
npm install git+https://github.com/oizpans/feathers-mq.git
```

## Sample Usage

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

  //listen to events, coming soon...

  // listen to `created` events on `products` service of mq-server app with name `ServerName`
  // app.service('ServerName.products').on('created', (data) => {
  //   console.log(data);
  // });

  // listen to `patched` events on `products` service of mq-server app with name `ServerName`
  // app.service('ServerName.products').on('patched', (data) => {
  //   console.log(data);
  // });

  // listen to all events on `products` service of mq-server app with name `ServerName`
  // app.service('ServerName.products').on('*', (data) => {
  //   console.log(data);
  // });

  // listen to `patched` events on all services of mq-server app with name `ServerName`
  // app.service('ServerName.*').on('patched', (data) => {
  //   console.log(data);
  // });

  // listen to all events on all services of mq-server app with name `ServerName`
  // app.service('ServerName.*').on('*', (data) => {
  //   console.log(data);
  // });

  // listen to all events on all services of all mq-server apps with app name
  // app.service('*.*').on('*', (data) => {
  //   console.log(data);
  // });

})();
```

### ChangeLogs
- **1.2.12** - remove nodemon dependency flatmap in package-lock, [Details](https://www.theregister.co.uk/2018/11/26/npm_repo_bitcoin_stealer/).
- **1.3.1** - Improve handling of errors. **[Issue here](https://github.com/oizpans/feathers-mq/issues/41)**
- **1.3.2** - backward-compatibility support on error handling.
