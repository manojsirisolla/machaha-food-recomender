const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    image: { type: String }
  }],
  subtotal: { type: String, required: true },
  deliveryFee: { type: String, required: true },
  tax: { type: String, required: true },
  total: { type: String, required: true },
  address: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  delivery: {
    date: { type: String, required: true },
    time: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
