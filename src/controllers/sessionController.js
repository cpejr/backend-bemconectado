const jwt = require('jsonwebtoken');
const Firebase = require('../models/firebaseModel');
const Ong = require('../models/ongModel');

module.exports = {

  async login(request, response) {
    try {

      // Autenticate user
      const { email, password } = request.body;

      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const accessToken = jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

        const user = { type: 'admin' };

        return response.json({ accessToken: accessToken, user });
      }
      else {
        const id_firebase = await Firebase.createSession(email, password)
        if (id_firebase !== undefined) {
          const user = await Ong.getByFirebaseId(id_firebase);
          user.type = "user";
          const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
          return response.json({ accessToken: accessToken, user });
        }
        else {
          return response.status(401).json({ message: 'Invalid credentials' })
        }
      }

    } catch (err) {
      console.log(err);
      return response.status(500).json({ error: 'Fatal error while validating login' })
    }
  },

  async authenticateToken(request, response, next) {
    const authHeader = request.headers['authorization']
    const [scheme, token] = authHeader && authHeader.split(' ');

    if (token === null) return response.status(401).json({ error: 'No token provided' });

    if (!/^Bearer$/i.test(scheme))
      return response.status(401).json({ error: 'Token badformatted' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return response.status(403).json({ verified: false, user: {}, error: err });
      return response.status(200).json({ verified: true, user: user });
      next();
    });
  }
}
