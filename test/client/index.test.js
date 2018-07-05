const feathers = require('@feathersjs/feathers');
const { expect } = require('chai');
const { Client } = require('../../lib');

module.exports = () => {
  describe('Client Test', () => {
    it('Cannot reassign service fn of app when no app name set', async () => {
      const app = feathers();
      app.configure(Client());
      expect(app.service.name).to.be.equal('service');
    });

    it('Successfully reassign service fn of app', async () => {
      const app = feathers();
      app.set('name', 'ClientTestName');
      app.configure(Client());
      expect(app.service.name).to.be.equal('natsService');
    });
  });
};
