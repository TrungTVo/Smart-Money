const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);


const TransactionSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    require: true
  },
  amount: {
    type: Float,
    required: true
  },
  category: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  payee: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: true
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;