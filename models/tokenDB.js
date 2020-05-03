const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: Object,
    required: true
  },
});

const Token = mongoose.model('Token', tokenSchema);

class TokenActions {

  static getToken() {
    return new Promise((resolve, reject) => {
      Token.findOne().then((result) => {
        if (result) {
          return resolve(result.token);
        } else {
          return resolve(undefined);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static updateToken(token) {
    return new Promise((resolve, reject) => {
      Token.findOneAndUpdate({}, { token: token }).then((result) => {
        if (!result) {
          Token.create({ token }).then((result) => {
            return resolve(result);
          }).catch((err) => {
            return reject(err);
          });
        }
        else {
          return resolve(result);
        }
      }).catch((err) => {
        return reject(err);
      });
    });
  }
}

module.exports = TokenActions