const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
  description: String,
  ingredients: [String],
  preparation: [String]
});

module.exports = mongoose.model('Food', FoodSchema);
