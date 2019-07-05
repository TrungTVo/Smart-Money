const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);


const AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  balance: {
    type: Float,
    required: true
  },
  budget: {
    type: Float,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;