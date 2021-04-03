const {celebrate, Joi} = require('celebrate');
const errorMessages = require('../errors/error-messages');
const {linkPattern} = require('./validation-utils');

module.exports.profileDataValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .error(new Joi.ValidationError(errorMessages.incorrectName)),
    about: Joi.string()
      .required()
      .min(2)
      .max(30)
      .error(new Joi.ValidationError(errorMessages.incorrectAbout)),
  }).unknown(true),
});

module.exports.avatarDataValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(linkPattern)
      .required()
      .error(new Joi.ValidationError(errorMessages.incorrectLink)),
  }).unknown(true),
});
