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
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static updateToken(token) {
    return new Promise((resolve, reject) => {
      Token.findOneAndUpdate({}, { token: token }).then((result) => {
        if (!result)
          Token.create(token).then((result) => {
            resolve(result);
          }).catch((err) => {
            reject(err);
          });
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = TokenActions