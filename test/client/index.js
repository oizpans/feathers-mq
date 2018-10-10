const feathers = require('@feathersjs/feathers');
const { Client } = require('../../lib');

module.exports = () => {
  describe('Client Test', () => {
    test('Throw error when no app name set', async () => {
      const app = feathers();

      function testMe() {
        return app.configure(Client());
      }

      expect(testMe).toThrow('App name is required');
    });

    test('Successfully reassign service fn of app', async () => {
      const app = feathers();
      app.set('name', 'ClientTestName');
      app.configure(Client());
      expect(app.service.name).toBe('bound natsService');
      expect(app.get('name')).toBe(`ClientTestName_${process.env.SETTINGS || 'local'}`);
      expect(typeof app.service('someapp.someservice').create).toBe('function');
      expect(typeof app.service('someapp.someservice').get).toBe('function');
      expect(typeof app.service('someapp.someservice').find).toBe('function');
      expect(typeof app.service('someapp.someservice').patch).toBe('function');
      expect(typeof app.service('someapp.someservice').update).toBe('function');
      expect(typeof app.service('someapp.someservice').remove).toBe('function');
    });
  });
};
