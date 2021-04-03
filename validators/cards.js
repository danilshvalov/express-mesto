const {celebrate, Joi} = require('celebrate');
const errorMessages = require('../errors/error-messages');
const {linkPattern} = require('./validation-utils');

module.exports.cardDataValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .error(new Joi.ValidationError(errorMessages.incorrectName)),
    link: Joi.string()
      .pattern(linkPattern)
      .required()
      .error(new Joi.ValidationError(errorMessages.incorrectLink)),
  }).unknown(true),
});
