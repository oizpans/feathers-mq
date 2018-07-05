const products = require('./products');
const custom = require('./custom');

module.exports = function services(app) {
  app.configure(products);
  app.configure(custom);
};
