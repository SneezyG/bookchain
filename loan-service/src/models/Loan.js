const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  bookId: { 
    type: String, 
    required: true 
  },
  loanedAt: { 
    type: Date, 
    default: Date.now 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  returnedAt: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['active', 'returned', 'overdue'], 
    default: 'active' 
  },
});

module.exports = mongoose.model('Loan', LoanSchema);
