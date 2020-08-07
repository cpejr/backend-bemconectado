const { Segments, Joi } = require('celebrate');

let counterValidator = new Object();

counterValidator.registerCount = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
    }),
}

module.exports = counterValidator;