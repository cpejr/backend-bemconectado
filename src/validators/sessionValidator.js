const { Segments, Joi } = require('celebrate');

let sessionValidator = new Object();

sessionValidator.login = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
}

module.exports = sessionValidator;