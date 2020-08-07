const { Segments, Joi } = require('celebrate');

let sessionValidator = new Object();

sessionValidator.login = {
    [Segments.PARAMS]: Joi.object().keys({
        password: Joi.string().required(),
    }),
}

module.exports = sessionValidator;