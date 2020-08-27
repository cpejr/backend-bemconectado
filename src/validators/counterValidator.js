const { Segments, Joi } = require('celebrate');

let counterValidator = new Object();

counterValidator.registerCount = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
}

counterValidator.getOngCountByDate = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
        year: Joi.number().integer().required(),
        month: Joi.number().integer().required(),
    }),
}

module.exports = counterValidator;