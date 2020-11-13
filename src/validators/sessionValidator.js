const { Segments, Joi } = require("celebrate");

const sessionValidator = {
  login: {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },

  forgotPassword: {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
    }),
  },
};

module.exports = sessionValidator;
