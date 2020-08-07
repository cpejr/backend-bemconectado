const { Segments, Joi } = require('celebrate');

let adminValidator = new Object();

adminValidator.index = {
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}

adminValidator.update = {
    [Segments.PARAMS]: Joi.object().keys({
        ongId: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().optional(),
        cnpj: Joi.string().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        neighborhood: Joi.string().optional(),
        street: Joi.string().optional(),
        number: Joi.string().optional(),
        complement: Joi.string().optional(),
        cep: Joi.string().optional(),
        picpay: Joi.string().optional(),
        facebook: Joi.string().optional(),
        instagram: Joi.string().optional(),
        ddd: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        email: Joi.string().optional(),
        site: Joi.string().optional(),
        branch: Joi.string().optional(),
        bank: Joi.string().optional(),
        approved: Joi.bool().optional(),
        bankAccount: Joi.string().optional(),
        description: Joi.string().optional(),
        imageSrc: Joi.string().optional(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}

adminValidator.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        ongId: Joi.string().required(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}

module.exports = adminValidator;