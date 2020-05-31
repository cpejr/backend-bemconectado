const Counter = require("../../models/counterDB");

module.exports = {

  async registerCount(request, response) {
    try {
      const { id } = request.params;
      const date = new Date(Date.now());
      let result = await Counter.registerCount(date, id);
      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error });
    }
  },
}