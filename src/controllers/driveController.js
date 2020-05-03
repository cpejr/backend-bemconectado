const { validateCredentials } = require('../models/googleDriveModel');

module.exports = {
  async validateCredentials(request, response) {
    try {
      const { code, scope } = request.query;
      await validateCredentials(code, scope)

      response.status(200).json({ response: 'ok' });
    } catch (err) {
      response.status(400).json({ error: 'Invalid data' });
    }
  }
}