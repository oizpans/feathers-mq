const serverTest = require('./client/index.test.js');
const clientTest = require('./server/index.test.js');

(async function runTests() {
  await serverTest();
  await clientTest();
}());
