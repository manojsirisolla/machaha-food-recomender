const mongoose = require('mongoose');
const User = require('./models/User');
require("dotenv").config();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/food-delivery', { family: 4 });

async function clearTestUser() {
  try {
    const email = 'djaijsi@gmail.com';
    const result = await User.deleteOne({ email });
    console.log(`Deleted ${result.deletedCount} user(s) with email: ${email}`);
    
    if (result.deletedCount > 0) {
      console.log('✅ Test user cleared successfully');
    } else {
      console.log('ℹ️ No user found with that email');
    }
  } catch (error) {
    console.error('Error clearing test user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clearTestUser();
