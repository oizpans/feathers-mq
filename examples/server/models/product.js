const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newSchema = new Schema({
 name:  String,
 price: String,
});

module.exports = mongoose.model('products', newSchema);
