const feathers = require('@feathersjs/feathers');
const { expect } = require('chai');
const { Server } = require('../../lib');

module.exports = () => {
  describe('Server Test', () => {
    it('Cannot setup subscriptions when no app name set', async () => {
      const app = feathers();
      app.configure(Server());
      expect(app.mqSuccess).to.be.equal(undefined);
    });

    it('Successfully setup nats subscriptions for app', async () => {
      const app = feathers();
      app.set('name', 'ServerTestName');
      app.configure(Server());
      expect(app.mqSuccess).to.be.equal(true);
    });
  });
};
