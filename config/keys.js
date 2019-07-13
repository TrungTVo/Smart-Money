// var dotenv = require('dotenv');
// dotenv.config();

module.exports = {
  mongoURI: //process.env.NODE_ENV === 'production' ? process.env.MONGO_URI :
   "mongodb+srv://trung:Ngosilien123@cluster0-r21n2.mongodb.net/smartMoney?retryWrites=true&w=majority",
  secretOrKey: //process.env.NODE_ENV === 'production' ? process.env.SECRET_OR_KEY :
   "secret"
}