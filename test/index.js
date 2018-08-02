const mongoose = require('mongoose');
const serverTest = require('./server/index.test.js');
const clientTest = require('./client/index.test.js');
const integrationTest = require('./integration/index.test.js');

mongoose.Promise = global.Promise;

describe('Running Tests', async () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://localhost:27017/feathers-mq-test', { useNewUrlParser: true });
    await mongoose.connection.dropDatabase();
  });

  await serverTest();
  await clientTest();
  await integrationTest();

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
