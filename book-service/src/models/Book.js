const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  available: {
    type: Boolean,
    default: true,  // Initially all books are available
  },
  currentLoan: {
    type: String, // Loan ID
    default: null,
  },
  currentHolder: {
    type: String, // User ID
    default: null,
  },
  tags: [{
    type: String,
    default: [],
  }],
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Book', bookSchema);
