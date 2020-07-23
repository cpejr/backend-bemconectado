const { Segments, Joi } = require('celebrate');
const routes = require('../routes');

let sessionValidator = new Object();

sessionValidator.login = {
    [Segments.PARAMS]: Joi.object().keys({
        password: Joi.string().required(),
    }),
}

module.exports = sessionValidator;