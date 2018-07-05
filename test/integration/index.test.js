const { expect } = require('chai');
const clientApp = require('../app/client');
require('../app/server');

module.exports = () => {
  describe('Integration Test', () => {
    it('Timeout error when there is no active app with specified app name', async () => {
      try {
        await clientApp.service('nonExistingApp.products').create({
          name: 'testproduct',
          price: '100',
        });
      } catch (e) {
        expect(e.message).to.be.equal('Request timed out.');
      }
    }).timeout(10000);

    it('Error when service does not exist on server app', async () => {
      try {
        await clientApp.service('ServerAppName.categories').create({
          name: 'testproduct',
          price: '100',
        });
      } catch (e) {
        expect(e.name).to.be.equal('NotFound');
      }
    });

    xit('Can call create method and get response', async () => {
      await clientApp.service('ServerAppName.products').create({
        name: 'testproduct',
        price: '100',
      });
    });
  });
};
