const products = require('./products');
const categories = require('./categories');

module.exports = function services(app) {
  app.configure(products);
  app.configure(categories);
};
