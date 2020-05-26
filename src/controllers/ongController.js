const Ong = require('../../models/ongDB')
const mongoose = require('mongoose');
const fs = require('fs');
const { Joi } = require('celebrate');
const emailController = require('./emailController')
const { uploadFile } = require('../models/googleDriveModel');


module.exports = {
  async create(request, response) {

    const schema = Joi.object({
      name: Joi.string().required(),
      cnpj: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      neighborhood: Joi.string().required(),
      street: Joi.string().required(),
      number: Joi.string().required(),
      cep: Joi.string().required(),
      email: Joi.string().required(),
      complement: Joi.string().optional(),
      picpay: Joi.string().optional(),
      facebook: Joi.string().optional(),
      instagram: Joi.string().optional(),
      ddd: Joi.string().optional(),
      phoneNumber: Joi.string().optional(),
      site: Joi.string().optional(),
      branch: Joi.string().optional(),
      bank: Joi.string().optional(),
      bankAccount: Joi.string().optional(),
      description: Joi.string().optional(),
      imageSrc: Joi.string().optional(),
    })

    schema.validate(request.body);

    try {
      let { name, cnpj } = request.body;
      const exist = await Ong.checkExistence(name, cnpj)
      console.log(exist);
      if (!exist) {
        let ong = request.body;

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