const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const actions = require('../actions/types');
const passport = require('passport');
const { map } = require('p-iteration');
var Mailgen = require('mailgen');

// load account model
const Account = require('../models/Account');

// load transaction model
const Transaction = require('../models/Transaction');

// contact
router.post('/contact', (req, res) => {
  const {name, email, phone, message} = req.body;
  var errors = {};

  if (typeof name === 'undefined' || (typeof name === 'string' && name.length === 0)) {
    errors.name = 'Please enter your name';
  }
  if (typeof email === 'undefined' || (typeof email === 'string' && email.length === 0)) {
    errors.email = 'Please enter your email';
  }
  if (typeof phone === 'undefined' || (typeof phone === 'string' && phone.length === 0)) {
    errors.phone = 'Please enter your phone';
  }
  if (typeof message === 'undefined' || (typeof message === 'string' && message.length === 0)) {
    errors.message = 'Please enter your message';
  }

  if (Object.keys(errors).length > 0) {
    // errors found
    return res.status(400).json({
      type: actions.LACK_INFO_FIELDS,
      errors: errors
    });

  } else {
    // send email to Trung
    // Configure Nodemailer SendGrid Transporter
    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          api_user: 'ttvo',    // SG username
          api_key: 'Trungtennis96#' // SG password
        },
      })
    );

    // Configure mailgen by setting a theme and your product info
    var mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        // Appears in header & footer of e-mails
        name: 'Smart Money',
        link: 'https://smart-money-vtt.herokuapp.com/',
      }
    });

    var email_info = {
      body: {
        name: 'Trung',
        intro: `You have a message from ${name}`,
        outro: `<p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Message: ${message}</p>
        `
      }
    };

    // Generate an HTML email with the provided contents
    var emailBody = mailGenerator.generate(email_info);
    
    // Create Email Options
    const options = {
      to: 'trung.vo.ron@gmail.com',
      from: email, 
      subject: `Smart Money - Message from ${name}`,
      text: `Hello from ${name}`,
      html: emailBody,             
    };

    // send mail with defined transport object
    transporter.sendMail(options, (error, info) => {
      if (error) throw error;
      //console.log(info);
      var success_obj = {
        success_msg: "Your message has been sent.",
      };
      return res.status(200).json(success_obj);
    });
    
  }
})

function analysis(data, month, transactions_list) {
  return new Promise((resolve, reject) => {
    var earned = 0.0;
    var expense = 0.0;
    map(transactions_list, async (transaction) => {
        if (transaction.date.split('/')[1] === month.toString().padStart(2, 0)) {
          data.data[transaction.category.trim().toLowerCase()] = typeof data.data[transaction.category.trim().toLowerCase()] === 'undefined' ? transaction.amount : data.data[transaction.category.trim().toLowerCase()] + transaction.amount
          if (transaction.amount > 0) {
            earned += transaction.amount;
          } else {
            expense += transaction.amount;
          }
        }
      }
    ).then(() => {
      data.earned = earned;
      data.expense = expense;
      resolve(data);
    })
  })
}

router.post('/analysis', 
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { account_id, month, year} = req.body;
    Account.findOne({_id: account_id})
      .then(account => {
        Transaction.find({ account: account_id, date: { $regex: new RegExp(year) } })
          .then(transactions => {
            var data = { data: {}, earned: 0.0, expense: 0.0 };
            analysis(data, month, transactions)
              .then(data => {
                res.status(200).json({
                  categories: Object.keys(data.data),
                  amounts: Object.values(data.data),
                  data: data.data,
                  earned: data.earned,
                  expense: data.expense,
                  account: account
                })
              })
          })
          .catch(err => { if (err) throw err; })
      })
      .catch(err => { if (err) throw err; })
  }
)

function overall_analysis(data, transactions_list) {
  return new Promise((resolve, reject) => {
    map(transactions_list, async (transaction) => {
      const month = parseInt(transaction.date.split('/')[1]);
      if (typeof data[month] === 'undefined') {
        if (transaction.amount < 0) {
          data[month] = { earned: 0.0, expense: transaction.amount };
        } else {
          data[month] = { earned: transaction.amount, expense: 0.0 };
        }
      } else {
        if (transaction.amount < 0) {
          data[month]['expense'] += transaction.amount;
        } else {
          data[month]['earned'] += transaction.amount;
        }
      }
    })
    .then(() => {
      for (var i=1; i<=12; i++) {
        if (typeof data[i] === 'undefined') {
          data[i] = {earned: 0.0, expense: 0.0}
        }
      }
    })
    .then(() => {
      resolve(data);
    })
  })
}

router.post('/overall_analysis',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { account_id, year } = req.body;
    Account.findOne({ _id: account_id })
      .then(account => {
        Transaction.find({ account: account_id, date: { $regex: new RegExp(year) } })
          .then(transactions => {
            var data = {};
            overall_analysis(data, transactions)
              .then(data => {
                res.status(200).json({
                  data: data,
                  account: account
                })
              })
          })
          .catch(err => { if (err) throw err; })
      })
      .catch(err => { if (err) throw err; })
  }
)


module.exports = router;