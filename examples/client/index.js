const feathers = require('@feathersjs/feathers');
const { Client } = require('../../lib');

const app = feathers();

app.set('name', 'ClientProjectName');

app.configure(Client());

(async () => {
  await app.service('ServerProjectName.products').create({
    name: 'Rice',
    price: 'Php 12',
  });
  const products = await app.service('ServerProjectName.products').find({});

  console.log('Client ran: ', products);
})();
