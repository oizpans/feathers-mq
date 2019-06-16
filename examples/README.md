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

// set the name of app
// required
app.set('name', 'ServerName');

// define services,
// set before MQ server
app.configure(services);

// set MQ server
app.configure(Server({
  url: 'localhost', // default to `localhost`
  port: 4222, // default to 4222
}));

module.exports = app;

```

### Client:
```js
const feathers = require('@feathersjs/feathers');
const { Client } = require('feathers-mq');

const app = feathers();

// set the name of app
// required
app.set('name', 'ClientName');

// setup mq transport for client
app.configure(Server({
  url: 'localhost', // default to `localhost`
  port: 4222, // default to 4222
  timeout: 5000, // default to 50000 ( 5 secs )
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
[< Back](../README.md)
