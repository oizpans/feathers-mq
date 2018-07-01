const app = require('../instance');
const {Server} = require('../../lib');

app.set('name','ProjectName');

app.configure(Server());

console.log('running server instance');
