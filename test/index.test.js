const mongoose = require('mongoose');
const serverTest = require('./server');
const clientTest = require('./client');
const integrationTest = require('./integration');
const clientApp = require('./app/client');
const serverApp = require('./app/server');

mongoose.Promise = global.Promise;

describe('Running Tests', async () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://localhost:27017/feathers-mq-test', { useNewUrlParser: true });
    await mongoose.connection.dropDatabase();
  });

  serverTest();
  clientTest();
  integrationTest();

  afterAll(async () => {
    clientApp.get('natsInstance').close();
    serverApp.get('natsInstance').close();
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
});
