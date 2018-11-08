const feathers = require('@feathersjs/feathers');
const { Server } = require('../../lib');

module.exports = () => {
  describe('Server Test', () => {
    test('Throw error when no app name set', async () => {
      const app = feathers();
      function testMe() {
        app.configure(Server());
      }
      expect(testMe).toThrow('App name is required');
    });

    test('Successfully setup nats subscriptions for app', async () => {
      const app = feathers();
      app.set('name', 'ServerTestName');
      app.configure(Server());
      expect(app.get('name')).toBe(`ServerTestName_${process.env.SETTINGS || 'local'}`);
      expect(typeof app.mq.subs).toBe('object');
    });
  });
};
