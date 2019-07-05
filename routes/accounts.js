const express = require('express');
const router = express.Router();
const passport = require('passport');

// load account model
const Account = require('../models/Account');

// load transaction model
const Transaction = require('../models/Transaction');

// add new account
router.post('/new',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    const { name, currency, balance, budget } = req.body;
    var errors = {};

    if (typeof name === 'undefined' || (typeof name === 'string' && name.length === 0)) {
      errors.name = 'Please enter account name';
    }
    if (typeof currency === 'undefined' || (typeof currency === 'string' && currency.length === 0)) {
      errors.currency = 'Please select currency type';
    }
    if (typeof balance === 'undefined' || (typeof balance === 'string' && balance.length === 0)) {
      errors.balance = 'Please enter account balance';
    }
    if (Object.keys(errors).length > 0) {
      // errors found
      return res.status(400).json(errors);
    } else {
      const new_account = new Account({
        user: req.user.id,
        name: name,
        currency: currency,
        balance: parseFloat(balance),
        budget: budget === '' || typeof budget === 'undefined' ? 0.0 : parseFloat(budget)
      })
      new_account.save()
        .then(() => res.status(200).json({
          success_msg: 'New account added.',
          new_account: new_account
        }))
        .catch(err => { if (err) throw err; })
    }
  }
)

// load all accounts
router.get('/all',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Account.find({user: req.user.id})
      .then(accounts => {
        res.status(200).json(accounts)
      })
      .catch(err => { if (err) throw err; })
  }
)

// load account with id
router.get(`/load/:account_id`,
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Account.findOne({user: req.user.id, _id: req.params.account_id})
      .then(account => res.status(200).json(account))
      .catch(err => { if (err) throw err; })
  }
)

// load all transactions of specified account
router.get(`/:account_id/transactions/all`,
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Transaction.find({ account: req.params.account_id })
      .sort({date: 'desc'})
      .then(transactions => {
        Account.findOne({_id: req.params.account_id})
          .then(account => {
            res.status(200).json({
              transactions: transactions,
              account: account
            })
          })
          .catch(err => { if (err) throw err; })
      })
      .catch(err => { if (err) throw err; })
  }
)

// update bank account
router.post(`/update/:account_id`,
  passport.authenticate('jwt', { session: false }), (req, res) => {
    const {account} = req.body;
    const {name, currency, balance} = account;
    var errors = {};

    if (typeof name === 'undefined' || (typeof name === 'string' && name.length === 0)) {
      errors.name = 'Please enter account name';
    }
    if (typeof currency === 'undefined' || (typeof currency === 'string' && currency.length === 0)) {
      errors.currency = 'Please select currency type';
    }
    if (typeof balance === 'undefined' || (typeof balance === 'string' && balance.length === 0)) {
      errors.balance = 'Please enter account balance';
    }
    if (Object.keys(errors).length > 0) {
      // errors found
      return res.status(400).json(errors);
    } else {
      Account.findOne({_id: req.params.account_id})
        .then(this_account => {
          this_account.name = account.name;
          this_account.currency = account.currency;
          this_account.balance = account.balance;
          this_account.budget = account.budget;

          // save
          this_account.save()
            .then(() => {
              res.status(200).json({
                success_msg: 'Updated successfully.',
                account_id: account.id,
                updated_account: this_account
              })
            })
            .catch(err => { if (err) throw err; })
        })
        .catch(err => { if (err) throw err; })
    }
  }
)

// delete bank account
router.delete('/delete/:account_id',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Transaction.deleteMany({account: req.params.account_id})
      .then(() => {
        Account.findOneAndDelete({ user: req.user.id, _id: req.params.account_id })
          .then(() => {
            res.status(200).json({
              success_msg: 'Deleted successfully.',
              account_id: req.params.account_id
            })
          })
          .catch(err => {
            if (err) throw err;
          })
      })
      .catch(err => {
        if (err) throw err;
      })
  }
)

// add transaction to a specific account
router.post('/:account_id/transactions/add',  
  passport.authenticate('jwt', { session: false }), (req, res) => {
    const {date, amount, category, notes, payee} = req.body;
    const errors = {};
    if (typeof date === 'undefined' || (typeof date === 'string' && date.length === 0)) {
      errors.date = 'Please enter date';
    } 
    if (typeof amount === 'undefined' || (typeof amount === 'string' && amount.length === 0)) {
      errors.amount = 'Please enter amount';
    } 
    if (Object.keys(errors).length > 0) {
      // errors found
      return res.status(400).json(errors);
    } else {
      const new_transaction = new Transaction({
        account: req.params.account_id,
        amount: parseFloat(amount),
        category: category,
        notes: notes,
        payee: payee,
        date: date
      })
      new_transaction.save()
        .then(transaction => {
          // update account balance
          Account.findById(req.params.account_id)
            .then(account => {
              account.balance += parseFloat(amount);
              account.save()
                .then(() => {
                  res.status(200).json({
                    success_msg: 'New transaction added',
                    new_transaction: transaction,
                    account: account
                  })
                })
                .catch(err => {if (err) throw err;})
            })
            .catch(err => {if (err) throw err;})
        })
        .catch(err => { if (err) throw err;} )
    }
  }
)

// update transaction of a specific account
router.post(`/:account_id/transactions/update`, 
  passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id, date, amount, category, notes, payee, bankAccount } = req.body;
    const errors = {};
    if (typeof date === 'undefined' || (typeof date === 'string' && date.length === 0)) {
      errors.date = 'Please enter date';
    }
    if (typeof amount === 'undefined' || (typeof amount === 'string' && amount.length === 0)) {
      errors.amount = 'Please enter amount';
    }
    if (Object.keys(errors).length > 0) {
      // errors found
      return res.status(400).json(errors);
    } else {
      Account.findOne({_id: bankAccount._id})
        .then(account => {
          Transaction.findOne({ _id: id })
            .then(transaction => {
              // update account balance
              const old_amount = transaction.amount;
              account.balance = account.balance - old_amount + parseFloat(amount);

              // save account
              account.save()
                .then(() => {
                  // save transaction
                  transaction.date = date;
                  transaction.amount = parseFloat(amount);
                  transaction.category = category;
                  transaction.notes = notes;
                  transaction.payee = payee;

                  transaction.save()
                    .then(() => {
                      res.status(200).json({
                        success_msg: 'Transaction updated',
                        updated_transaction: transaction,
                        updated_account: account
                      })
                    })
                    .catch(err => { if (err) throw err; })
                })
                .catch(err => { if (err) throw err; })
            })
            .catch(err => { if (err) throw err; })
        })
        .catch(err => { if (err) throw err; })
    }
  }
)

// delete transaction of a specific account
router.post(`/:account_id/transactions/delete/:transaction_id`,
  passport.authenticate('jwt', { session: false }), (req, res) => {
    const { account_id, transaction_id } = req.params;
    const {transaction_amount} = req.body;

    Transaction.findOneAndDelete({ _id: transaction_id, account: account_id})
      .then(() => {
        // update account balance
        Account.findOne({_id: account_id})
          .then(account => {
            account.balance -= transaction_amount;
            account.save()
              .then(() => {
                res.status(200).json({
                  success_msg: 'Transaction deleted',
                  account: account
                })
              })
              .catch(err => { if (err) throw err; })
          })
          .catch(err => { if (err) throw err; })
      })
      .catch(err => { if (err) throw err; })
  }
)

module.exports = router;