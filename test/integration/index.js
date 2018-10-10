const clientApp = require('../app/client');
require('../app/server');

module.exports = () => {
  let productId;

  describe('Integration Test', () => {
    test('Timeout error when there is no active app with specified app name', async () => {
      jest.setTimeout(10000);
      try {
        await clientApp.service('nonExistingApp.products').create({
          name: 'testproduct',
          price: '100',
        });
      } catch (e) {
        expect(e.message).toBe('Request timed out.');
      }
    });

    test('Error when service does not exist on server app', async () => {
      try {
        await clientApp.service('ServerAppName.categories').create({
          name: 'testproduct',
          price: '100',
        });
      } catch (e) {
        expect(e.name).toBe('NotFound');
      }
    });

    test('Can call create method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').create({
        name: 'testproduct',
        price: '100',
      });
      productId = result._id;
      expect(result.name).toBe('testproduct');
      expect(result.price).toBe('100');
      expect(result._id).toBeTruthy();
    });

    test('Can call get method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').get(productId);
      expect(result.name).toBe('testproduct');
      expect(result.price).toBe('100');
      expect(result._id.toString()).toBe(productId);
    });

    test('Can call find method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').find({});
      expect(result.total).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.skip).toBe(0);
      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe('testproduct');
      expect(result.data[0].price).toBe('100');
      expect(result.data[0]._id.toString()).toBe(productId);
    });

    test('Can call patch method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').patch(productId, { name: 'newtestproduct' });
      expect(result.name).toBe('newtestproduct');
      expect(result.price).toBe('100');
      expect(result._id.toString()).toBe(productId);
    });

    test('Can call update method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').update(productId, { price: '1000' });
      expect(result.name).toBe(undefined);
      expect(result.price).toBe('1000');
      expect(result._id.toString()).toBe(productId);
    });

    test('Can call remove method on normal service and get response', async () => {
      const result = await clientApp.service('ServerAppName.products').remove(productId);
      expect(result.name).toBe(undefined);
      expect(result.price).toBe('1000');
      expect(result._id.toString()).toBe(productId);
      const findResult = await clientApp.service('ServerAppName.products').find({});
      expect(findResult.total).toBe(0);
      expect(findResult.limit).toBe(2);
      expect(findResult.skip).toBe(0);
      expect(findResult.data.length).toBe(0);
    });

    test('Can call existing create method on custom service and get response', async () => {
      const result = await clientApp.service('ServerAppName.custom').create({
        word: 'testcustomdata',
        number: 12342532623,
      });
      expect(result.customServiceResult.word).toBe('testcustomdata');
      expect(result.customServiceResult.number).toBe(12342532623);
    });

    test('Error calling nonexisting get method on custom service', async () => {
      try {
        await clientApp.service('ServerAppName.custom').get('12423564374574634');
      } catch (e) {
        expect(e.name).toBe('MethodNotAllowed');
        expect(e.message).toBe('Method `get` is not supported by this endpoint.');
      }
    });

    test('Error calling nonexisting find method on custom service', async () => {
      try {
        await clientApp.service('ServerAppName.custom').find({});
      } catch (e) {
        expect(e.name).toBe('MethodNotAllowed');
        expect(e.message).toBe('Method `find` is not supported by this endpoint.');
      }
    });

    test('Error calling nonexisting patch method on custom service', async () => {
      try {
        await clientApp.service('ServerAppName.custom').patch('12423532643643', { word: 'somewhere' });
      } catch (e) {
        expect(e.name).toBe('MethodNotAllowed');
        expect(e.message).toBe('Method `patch` is not supported by this endpoint.');
      }
    });

    test('Error calling nonexisting update method on custom service', async () => {
      try {
        await clientApp.service('ServerAppName.custom').update('12423532643643', { word: 'somewhere' });
      } catch (e) {
        expect(e.name).toBe('MethodNotAllowed');
        expect(e.message).toBe('Method `update` is not supported by this endpoint.');
      }
    });

    test('Error calling nonexisting remove method on custom service', async () => {
      try {
        await clientApp.service('ServerAppName.custom').remove('12423532643643');
      } catch (e) {
        expect(e.name).toBe('MethodNotAllowed');
        expect(e.message).toBe('Method `remove` is not supported by this endpoint.');
      }
    });
  });
};
