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

// setup mq transport for server
app.configure(Server({
  host: 'localhost', // hostname for NATS - optional (defaults to `localhost`)
  ports: 4222, // port(s) for NATS - optional (defaults to 4222)
}));

app.configure(services);

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
  await app.service('ServerName.products').create({
    name: 'Rice',
    price: 'Php 12',
  });
  const products = await app.service('ServerName.products').find({});

  console.log('Products: ', products);
})();
```
