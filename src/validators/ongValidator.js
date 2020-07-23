const { Segments, Joi } = require('celebrate');

let ongValidator = new Object();

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