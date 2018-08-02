const feathers = require('@feathersjs/feathers');
const { Client } = require('../../lib');

module.exports = () => {
  describe('Client Test', () => {
    it('Throw error when no app name set', async () => {
      const app = feathers();

      function testMe() {
        return app.configure(Client());
      }

      expect(testMe).to.throw('App name is required');
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
