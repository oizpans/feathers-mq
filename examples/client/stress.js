const feathers = require('@feathersjs/feathers');
const { Client } = require('../../lib');

const app = feathers();

app.set('name', 'stress');

app.configure(Client());

let counter = 1;
const runner = () => {
  run();
setTimeout(function(){
  runner();
  counter++;
}, 500);
}

const run = () => {
 console.log('Stress', counter);

 app.service('ServerProjectName.products')
 .create({
      name: 'Rice',
      price: 'Php 12',
    })
    .catch((e)=>{
      console.log(e);
    })

}


runner();
