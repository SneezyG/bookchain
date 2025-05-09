const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  currentBooks: [{
    type: String, // Book IDs
    default: [],
  }],
  loanHistory: [{
    type: String, // Loan IDs
    default: [],
  }],
  bookHistory: [{
    type: String, // Book IDs
    default: [],
  }],
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active',
  }
});

module.exports = mongoose.model('User', userSchema);
