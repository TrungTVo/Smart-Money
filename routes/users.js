const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretOrKey = require('../config/keys').secretOrKey;
//const multer = require('multer');
//const upload = multer();
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const fs = require('fs');
const ejs = require('ejs');
const hash = require('../utils/hash');
const passport = require('passport');

// load User model
const User = require('../models/User');
// load account model
const Account = require('../models/Account');
// load transaction model
const Transaction = require('../models/Transaction');

// HTML email template for when user requests to reset password
var template = fs.readFileSync('./views/email.ejs', 'utf-8' );

const actions = require('../actions/types');

// +++++++++++++ register new user +++++++++++++ 
router.post('/register', (req, res) => {
  const { name, email, password1, password2 } = req.body;
  var errors = {};

  if (!name || (typeof name === 'undefined') || 
      (typeof name === 'string' && name.length === 0)) {
    errors.name = 'Please enter your full name';
  }
  if (!email || (typeof email === 'undefined') ||
    (typeof email === 'string' && email.length === 0)) {
    errors.email = 'Please enter your email address';
  }
  if (!password1 || (typeof password1 === 'undefined') ||
    (typeof password1 === 'string' && password1.length < 6)) {
    errors.password1 = 'Password must contain at least 6 characters';
  } else {
    if (password1 != password2) {
      errors.password2 = 'Passwords do not match';
    }
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      type: actions.LACK_INFO_FIELDS,
      errors: errors
    });
  } else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          // user exists
          errors.error_msg = `This user already exists`;
          return res.status(400).json({
            type: actions.DUPLICATE_USER,
            errors: errors
          });
        } else {
          // user is valid, start register new user
          const defaultImageUrl = 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png';
          // create new user
          const newUser = {
            name: name,
            email: email,
            imageUrl: defaultImageUrl,
            password: password1
          };
          // register
          createUser(newUser, res);
        }
      })
      .catch(err => {if (err) throw err});
  }
});


// +++++++++++++ Login +++++++++++++
router.post('/login', (req, res) => {
  const {email, password} = req.body;
  var errors = {};
  if (!email || (typeof email === 'undefined') ||
    (typeof email === 'string' && email.length === 0)) {
    errors.email = 'Please enter your email address';
  }
  if (!password || (typeof password === 'undefined') ||
    (typeof password === 'string' && password.length == 0)) {
    errors.password = 'Please enter your password';
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      type: actions.LACK_INFO_FIELDS,
      errors: errors
    });
  } else {
    User.findOne({email: email})
      .then(user => {
        if (!user) {
          errors.error_msg = 'User not found!';
          return res.status(400).json({
            type: actions.USER_NOT_FOUND_OR_WRONG_PASSWORD,
            errors: errors
          });
        } else {
          // Check Password
          bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
              // User Matched
              signInToken(user, res, '');
            } else {
              errors.error_msg = 'Password incorrect!';
              return res.status(400).json({
                type: actions.USER_NOT_FOUND_OR_WRONG_PASSWORD,
                errors: errors
              });
            }
          });
        }
      })
      .catch(err => {
        if (err) throw err;
      })
  }
})

// Log in with Google
router.post('/googleLogin', (req, res) => {
  const { name, email, imageUrl } = req.body;
  // find user
  User.findOne({email: email})
    .then(user => {
      if (user) {
        // user exists, log in with that user
        user.imageUrl = imageUrl;
        signInToken(user, res, '');

        // save user
        user.save().catch(err => { if (err) throw err; })
      } else {
        // user not exists, create new user and log in
        // default password
        const defaultPassword = 'TempPass123!';
        const user = {
          name: name, email: email, password: defaultPassword, imageUrl: imageUrl
        }
        const newUser = new User(user);

        // hash password
        hash(newUser.password).then(hashed_password => {
          newUser.password = hashed_password;
          // save new user to DB
          newUser.save()
            .catch(err => { if (err) throw err });

          // sign in
          signInToken(newUser, res, '');
        })
        .catch(err => { if (err) throw err });
        
      }
    })
    .catch(err => {
      if (err) throw err;
    })
})


// Log in with Facebook
router.post('/facebookLogin', (req, res) => {
  const { name, email, imageUrl } = req.body;
  // find user
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        // user exists, log in with that user
        user.imageUrl = imageUrl;
        signInToken(user, res, '');

        // save user
        user.save().catch(err => { if (err) throw err; })
      } else {
        // user not exists, create new user and log in
        // default password
        const defaultPassword = 'TempPass123!';
        const user = {
          name: name, email: email, password: defaultPassword, imageUrl: imageUrl
        }
        const newUser = new User(user);

        // hash password
        hash(newUser.password).then(hashed_password => {
          newUser.password = hashed_password;
          // save new user to DB
          newUser.save()
            .catch(err => { if (err) throw err });

          // sign in
          signInToken(newUser, res, '');
        })
          .catch(err => { if (err) throw err });

      }
    })
    .catch(err => {
      if (err) throw err;
    })
})

// verify user email to reset password
router.post('/verify', (req, res) => {
  const { email } = req.body;
  
  if (typeof email === 'undefined' || (typeof email === 'string' && (email === '' || email.length === 0))) {
    var error = { error_msg: `Please enter your email!` };
    return res.status(400).json(error);
  }
  User.findOne({ email: email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      // no user found
      var error = { error_msg: `User with this email not found!`};
      return res.status(400).json(error);
    } else {
      // send email to exist user
      // Configure Nodemailer SendGrid Transporter
      const transporter = nodemailer.createTransport(
        sendgridTransport({
          auth: {
            api_user: 'ttvo',    // SG username
            api_key: 'Trungtennis96#' // SG password
          },
        })
      );

      // generate a random reset password token
      crypto.randomBytes(16, (err, buf) => {
        var token = buf.toString('hex');

        // save user reset password token to DB
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        // update user
        user.save((err) => {
          if (err) throw err
        });
        
        // HTML output to be sent to receiver email
        const output = ejs.render(template, {
          resetUrl: process.env.NODE_ENV !== 'production' ? `http://${req.headers['x-forwarded-host']}/users/reset/${token}` : `https://smart-money-vtt.herokuapp.com/users/reset/${token}`
        });
        
        // Create Email Options
        const options = {
          to: email,
          from: 'trung.vo.ron@gmail.com', // Totally up to you
          subject: 'Smart Money - Password reset request',
          html: output,             // For sending HTML emails
        };

        // send mail with defined transport object
        transporter.sendMail(options, (error, info) => {
          if (error) throw error;
          //console.log(info);
          var success_obj = {
            success_msg: "Email sent! (Be sure to check spam folder)",
          };
          return res.status(200).json(success_obj);
        });
      })
    }
  })
})

// +++++++++++++ Reset password +++++++++++++
router.get('/reset/:token', (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      var error = {error_msg: 'Link expired! Try again!'};
      return res.status(400).json(error);
    } else {
      return res.status(200).json(user);
    }
  })
})


// update new password
router.post('/reset/update_password', (req, res) => {
  const { user, password, confirm_password} = req.body;
  var errors = {};
  if (typeof password === 'undefined' || (typeof password === 'string' && password.length < 6)) {
    errors.password = 'Please enter new password, at least 6 characters!'
  } else if (typeof confirm_password === 'undefined' || 
      (typeof confirm_password === 'string' && confirm_password !== password)) {
    errors.confirm_password = 'Passwords do not match!'
  }
  
  if (Object.keys(errors).length > 0) {
    // errors found
    return res.status(400).json({
      type: actions.UPDATE_PASSWORD,
      errors: errors
    });
  } else {
    User.findOne({
      _id: user._id,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpires: {$gt: Date.now() }
    }).then(async (user) => {
        if (!user) {
          // no user found
          errors.error_msg = 'Link expired! Try again!'
          return res.status(400).json({
            type: actions.PASSWORD_RESET,
            errors: errors
          });
        } else {
          // hash password and update
          hash(password).then(hashed_password => {
            user.password = hashed_password;
            // save new user to DB
            user.save()
              .catch(err => { if (err) throw err });

            return res.status(200).json({
              success_msg: 'Your password has been updated.'
            })
          })
          .catch(err => { if (err) throw err; });          
        }
      })
      .catch(err => {
        if (err) throw err;
      })
  }
})

// update user account
router.post('/update',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    const {user_name} = req.body;
    if (user_name === '') {
      res.status(400).json({
        type: actions.UPDATE_USER,
        errors: {error_msg: 'Please enter your name'}
      })
    } else {
      User.findOne({_id: req.user.id})
        .then(user => {
          user.name = user_name;
          // save
          user.save()
            .then(() => {
              // res.status(200).json({
              //   success_msg: 'Your profile has been updated',
              //   user: user
              // })
              signInToken(user, res, 'Your profile has been updated');
            })
            .catch(err => {
              if (err) throw err;
            })
        })
        .catch(err => {
          if (err) throw err;
        })
    }
  }
)

// delete user account
router.delete('/delete',
  passport.authenticate('jwt', { session: false }), (req, res) => {
  //console.log(req.user);
  Account.find({user: req.user.id})
    .then(accounts => {
      accounts.forEach(account => {
        Transaction.deleteMany({account: account.id}).catch(err => {if (err) throw err;})
      })
    })
    .then(() => {
      Account.deleteMany({user: req.user.id})
        .then(() => {
          User.findOneAndDelete({ _id: req.user.id })
            .then(() =>
              res.status(200).json({
                success_msg: 'Your account has been deleted.'
              })
            ).catch(err => {
              if (err) throw err;
            })
        })
        .catch(err => { if (err) throw err; })
    })
    .catch(err => {if (err) throw err;})
  }
)


// ================= HELPER FUNCTIONS =================
signInToken = (user, res, message) => {
  // Create JWT Payload
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl
  };

  // Sign Token
  jwt.sign(
    payload,
    secretOrKey,
    { expiresIn: 3600 },
    (err, token) => {
      res.json({
        success: true,
        token: 'Bearer ' + token,
        success_msg: message,
        user: user
      });
    }
  );
}


createUser = (user, res) => {
  const {name, email, password, imageUrl} = user;
  // create new user
  const newUser = new User({
    name: name,
    email: email,
    imageUrl: imageUrl,
    password: password
  });

  // hash password
  hash(newUser.password).then(hashed_password => {
    newUser.password = hashed_password;

    // save new user to DB
    newUser.save()
      .then(() => {
        //console.log('Success: ' + user);
        res.status(200).json({
          success_msg: 'Welcome! You can now log in.',
          new_user: newUser
        });
      })
      .catch(err => { if (err) throw err });
  })
  .catch(err => {if (err) throw err; });
}


// Get all users
router.get('/all', (req, res) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json({noUsersFound: 'No users found!'}));
})

module.exports = router;