# feathers-mq
FeathersJS message queue wrapper for the client and server.

## Issues
- cant used eslint v5 for **[now](https://github.com/airbnb/javascript/issues/1845)**.

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
  host: 'localhost', // hostname for NATS - optional (defaults to `localhost`)
  ports: 4222, // port(s) for NATS - optional (defaults to 4222)
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
  host: 'localhost', // hostname for NATS - optional (defaults to `localhost`)
  ports: 4222, // port(s) for NATS - optional (defaults to 4222)
}));

(async () => {
  // use `${serverAppName}.${serviceName}` as parameter to app.service

  //listen to events

  // listen to `created` events on `products` service of mq-server app with name `ServerName`
  app.service('ServerName.products').on('created', (data) => {
    console.log('im listening to created ', data);
  });

  // listen to `patched` events on `products` service of mq-server app with name `ServerName`
  app.service('ServerName.products').on('patched', (data) => {
    console.log('im listening to patched ', data);
  });

  // listen to all events on `products` service of mq-server app with name `ServerName`
  app.service('ServerName.products').on('*', (data) => {
    console.log('im listening to created ', data);
  });

  // listen to `patched` events on all services of mq-server app with name `ServerName`
  app.service('ServerName.*').on('patched', (data) => {
    console.log('im listening to patched ', data);
  });

  // listen to all events on all services of mq-server app with name `ServerName`
  app.service('ServerName.*').on('*', (data) => {
    console.log('im listening to patched ', data);
  });

  // listen to all events on all services of all mq-server apps with app name
  app.service('*.*').on('*', (data) => {
    console.log('im listening to patched ', data);
  });

  // call `create` method on `products` service of mq-server app with name `ServerName`
  await app.service('ServerName.products').create({
    name: 'Rice',
    price: 'Php 12',
  });
  const products = await app.service('ServerName.products').find({});

  console.log('Products: ', products);
})();
```
