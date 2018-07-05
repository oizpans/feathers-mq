const { expect } = require('chai');
const { Client } = require('../lib');

describe('Client Test', () => {
  xit('Timeout when no server instance active', async () => {
    try {
      await namedClientApp.service('ServerTestName.products').create({
        name: 'testproduct',
        price: '100',
      });
    } catch (e) {
      expect(e.message).to.be.equal('Request timed out.');
    }
  }).timeout(10000);
});
