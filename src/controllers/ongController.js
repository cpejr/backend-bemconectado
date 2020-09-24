const Ong = require('../models/ongModel');
const { Joi } = require('celebrate');
const emailController = require('./emailController');
const { uploadFile } = require('../models/gDriveModel');
const Firebase = require('../models/firebaseModel');
const { update } = require('../models/ongModel');

module.exports = {
  async create(request, response) {
    try {
      let { name, cnpj, password, email } = request.body;
      const exist = await Ong.checkExistence(name, cnpj)
      console.log(exist);
      if (!exist) {
        let ong = request.body;
        try {
          const id_firebase = await Firebase.createNewOng(email, password);
          ong.firebase = id_firebase;
        }
        catch (error) {
          console.log(error);
        }
        if (!request.file)
          return response.status(400).json({ message: 'Por favor selecione uma logo' })

        const { originalname, buffer, mimetype } = request.file;


        const imageSrc = await uploadFile(buffer, originalname, mimetype)

        ong.imageSrc = imageSrc;

        let { _id } = await Ong.createNew(ong);

        emailController.userWaitingForApproval(ong.email, ong.name);

        return response.status(200).json({ _id, name });

      }
      else {
        return response.status(409).json({ error: 'Ong já existente' });
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error });
    }
  },

  async index(request, response) {
    try {
      const { page, city, state, name, categs } = request.query;

      const _categs = categs ? categs.split(',') : undefined;
      let result = await Ong.getAprovedOngs(page, city, state, name, _categs);

      if (!result[0] || !result[0].totalCount) {
        response.header("X-Total-Count", 0);
        result = [];
      }
      else {
        response.header("X-Total-Count", result[0].totalCount);
        result = result[0].ongs;
      }

      return response.json(result);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error });
    }
  },

  async update(request, response){
    const { id } = request.params;
    const newOngData = request.body;
    
    try{
      let result = await Ong.update(id, newOngData);

      return response.status(200).json(result);

    } catch(error){
      console.log(error);
      return response.status(500).json({ message: 'Internal server when trying to update ONG.' });
    }
  },

  async delete(request, response) {
    try {
      let id = request.params.ongId;

      const _ong = await Ong.getById(id);
      emailController.userRejectedEmail(_ong.email, _ong.name);

      let result = await Ong.deleteOng(id);


      return response.json({ object: result, message: 'deletado com sucesso' });
    } catch (error) {
      if (error.name === "CastError") {
        return response.status(400).json({ error: error });
      }

      console.log(error);
      return response.status(500).json({ error: error });
    }
  },

  async totalApproved(request, response) {
    try {
      const { city, state, name, categs } = request.query;

      const _categs = categs ? categs.split(',') : undefined;

      const result = await Ong.getTotalApprovedOngs(city, state, name, _categs);

      response.header("X-Total-Count", result);
      return response.status(200).json("ok");

    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error });
    }
  },

};