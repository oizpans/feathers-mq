const mongoose = require('mongoose');
const serverTest = require('./server/index.test.js');
const clientTest = require('./client/index.test.js');
const integrationTest = require('./integration/index.test.js');

mongoose.Promise = global.Promise;

(async function runTests() {
  await serverTest();
  await clientTest();
  await integrationTest();
}());
