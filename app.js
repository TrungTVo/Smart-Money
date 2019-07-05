const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

// initialize
const app = express();
const PORT = process.env.PORT || 5000;

// public static files
app.use(express.static(__dirname + '/public'));

// EJS
//app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const dbURI = require('./config/keys').mongoURI;
mongoose.connect(dbURI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(`Error while connecting to MongoDB:\n${err}`));

var conn = mongoose.connection;

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/accounts', require('./routes/accounts'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, console.log(`Server started on port ${PORT}...`));
