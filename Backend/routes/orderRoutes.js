const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

// Place a new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, tax, total, address, delivery, paymentMethod } = req.body;

    const newOrder = new Order({
      user: req.user.id,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      address,
      delivery,
      paymentMethod
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
