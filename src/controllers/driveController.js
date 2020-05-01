const { validateCredentials } = require('../models/googleDriveModel');

module.exports = {
  //code=4/zQHNqGiRFFYTAcRai5dDCEJIEbWPxT0XBtaBrZhEjQ1rvSg9p_XBNXTaI0gMePXzw2o7MQ3wvUH-MRzZFxxV_ZY&scope=https://www.googleapis.com/auth/drive
  async validateCredentials(request, response) {
    try {
      const { code, scope } = request.query;
      await validateCredentials(code, scope)

      response.status(200);
    } catch (err) {
      response.status(500);
    }
  }
}