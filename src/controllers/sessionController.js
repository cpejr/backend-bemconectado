const jwt = require('jsonwebtoken');

module.exports = {

  async login(request, response) {
    try {

      // Autenticate user
      const { email, password } = request.body;

      if (password !== process.env.ADMIN_PASSWORD) {
        return response.status(400).json({ error: 'Invalid password!' }); 
      }
      if (email !== process.env.ADMIN_EMAIL) {
        return response.status(400).json({ error: 'Invalid credentials!' }); 
      }

      const accessToken = jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

      const user = {type: 'admin'};

      return response.json({ accessToken: accessToken, user });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ error: 'Fatal error while validating login' })
    }
  },
}