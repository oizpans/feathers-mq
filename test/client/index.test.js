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
      expect(typeof app.service('someapp.someservice').create).to.be.equal('function');
      expect(typeof app.service('someapp.someservice').get).to.be.equal('function');
      expect(typeof app.service('someapp.someservice').find).to.be.equal('function');
      expect(typeof app.service('someapp.someservice').patch).to.be.equal('function');
      expect(typeof app.service('someapp.someservice').update).to.be.equal('function');
      expect(typeof app.service('someapp.someservice').remove).to.be.equal('function');
    });
  });
};
