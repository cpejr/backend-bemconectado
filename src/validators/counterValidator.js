const { Segments, Joi } = require('celebrate');

let counterValidator = new Object();

counterValidator.registerCount = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
}

counterValidator.getOngCount = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
        year: Joi.number().integer().optional(),
        month: Joi.number().integer().optional(),
    }).with("year","month").with("month","year"),
}

module.exports = counterValidator;