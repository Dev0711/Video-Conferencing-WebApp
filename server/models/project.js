const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);