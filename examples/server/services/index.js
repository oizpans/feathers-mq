const products = require('./products');

module.exports = function(app){
  app.configure(products);
}
