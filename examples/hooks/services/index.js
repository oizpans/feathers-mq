const products = require('./products');

module.exports = function services(app) {
  app.configure(products);
};
