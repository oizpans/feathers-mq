const hooks = require('./hooks');
const service = require('./service');

module.exports = function products(app) {
  app.use('categories', service());
  app.service('categories').hooks(hooks);
};
