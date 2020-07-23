const { validateCredentials } = require('../models/gDriveModel');

module.exports = {
  async validateCredentials(request, response) {
    try {
      const code = decodeURI(request.query.code);
      const scope = decodeURI(request.query.scope);

      await validateCredentials(code, scope)

      response.status(200).json({ response: 'ok' });
    } catch (err) {
      response.status(400).json({ error: 'Invalid data' });
    }
  }
}