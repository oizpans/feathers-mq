const mongoose = require('mongoose');
const serverTest = require('./server/index.test.js');
const clientTest = require('./client/index.test.js');
const integrationTest = require('./integration/index.test.js');

mongoose.Promise = global.Promise;

describe('Running Tests', async () => {
  before(async () => {
    mongoose.connect('mongodb://localhost/feathers-mq-test');
    await mongoose.connection.dropDatabase();
  });

  await serverTest();
  await clientTest();
  await integrationTest();

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
