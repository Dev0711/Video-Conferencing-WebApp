// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // Set default value to false
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
