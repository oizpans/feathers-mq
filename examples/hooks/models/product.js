const mongoose = require('mongoose');

const { Schema } = mongoose;

const newSchema = new Schema({
  name: String,
  price: Number,
}, { versionKey: false });

module.exports = mongoose.model('products', newSchema);
