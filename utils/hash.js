const bcrypt = require('bcryptjs');

// generate salt
genSalt = () => {
  return new Promise((resolve, reject) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        reject(err);
      } else {
        resolve(salt);
      }
    });
  });
}

// hash the password with the salt
genHash = (salt, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

hashPassword = (password) => {
  // hash password
  return new Promise((resolve, reject) => {
    genSalt()
      .then(salt => {
        genHash(salt, password)
          .then(hash => {
            resolve(hash);
          })
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

module.exports = hashPassword;