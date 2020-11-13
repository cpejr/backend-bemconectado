const Ong = require('../models/ongModel');
const emailController = require('./emailController');
const Firebase = require('../models/firebaseModel');
const { v4: uuidv4 } = require('uuid');

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
        let newPassword = uuidv4();
        newPassword = newPassword.slice(0, 6);
        const uid = await Firebase.createNewOng(_ong.email, newPassword);
        updateFields.firebase = uid;
        emailController.userApprovedEmail(_ong.email, _ong.name, newPassword);
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
