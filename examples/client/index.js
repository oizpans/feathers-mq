const feathers = require('@feathersjs/feathers');
const { Client } = require('../../lib');

const app = feathers();

app.set('name', 'ClientProjectName');

app.configure(Client());

(async () => {
  // app.service('ServerProjectName.products').on('created', (data) => {
  //   console.log('im listening to created ', data);
  // });
  //
  // app.service('ServerProjectName.products').on('patched', (data) => {
  //   console.log('im listening to patched ', data);
  // });
  console.log('Client running');


 app.service('ServerProjectName.products')
 .create({
      name: 'Rice',
      price: 'Php 12',
    })
    .catch((e)=>{
      console.log(e);
    })
  // await app.service('ServerProjectName.products').patch(result._id, {
  //   name: 'Rices',
  // });
  // const products = await app.service('ServerProjectName.products').find({});

})();
