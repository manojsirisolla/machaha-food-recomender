const express = require('express');
const Food = require('../models/Food');

const router = express.Router();

router.get('/', async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

router.post('/', async (req, res) => {
  const food = new Food(req.body);
  await food.save();
  res.json({ message: 'Food added' });
});

module.exports = router;
