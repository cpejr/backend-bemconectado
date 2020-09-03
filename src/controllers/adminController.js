const Ong = require('../models/ongModel')
const emailController = require('./emailController')

module.exports = {

  async index(request, response) {
    try {
      let result = await Ong.getWaitingAprovement();
      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error });
    }
  },

  async update(request, response) {
    try {
      let id = request.params.ongId;
      let updateFields = request.body;
      
      if (updateFields.approved && updateFields.approved === true){
        const _ong = await Ong.getById(id);
        emailController.userApprovedEmail(_ong.email, _ong.name);
      }

      let result = await Ong.update(id, updateFields);

      return response.json({_id: result._id, message: 'atualizado com sucesso'});

    } catch (error) {
      if (error.name === "CastError") {
        return response.status(400).json({ error: error });
      }

      console.log(error);
      return response.status(500).json({ error: error });
    }
  },
}
