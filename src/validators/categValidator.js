const { Segments, Joi } = require('celebrate');

const categValidator = new Object();

categValidator.index = {
    [Segments.QUERY]: Joi.object().keys({
        cat: Joi.array().optional(),
    })
}

categValidator.create = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        ongs: Joi.array().optional(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}

categValidator.categorize = {
    [Segments.BODY]: Joi.object().keys({
        ong: Joi.object().required(),
        categ: Joi.array().required(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}

categValidator.delete = {
    [Segments.PARAMS]: Joi.object().keys({
        name: Joi.string().required(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}

categValidator.searchCategs = {
    [Segments.PARAMS]: Joi.object().keys({
        ongId: Joi.string().required(),
    }),
}

categValidator.searchOngs = {
    [Segments.BODY]: Joi.object().keys({
        names: Joi.array().required(),
    }),
}

module.exports = categValidator;