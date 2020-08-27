const { Segments, Joi } = require('celebrate');

let ongValidator = new Object();

ongValidator.create = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        password: Joi.string().required(),
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
}

ongValidator.index = {
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        page: Joi.number().optional(),
        name: Joi.string().optional(),
        categs: Joi.string().optional(),
    }),
}

ongValidator.totalApproved = {
    [Segments.QUERY]: Joi.object().keys({
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        name: Joi.string().optional(),
        categs: Joi.string().optional(),
    }),
}

module.exports = ongValidator;