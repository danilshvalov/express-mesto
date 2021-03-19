const mongoose = require('mongoose');

module.exports.dispatchError = (err, NewErrorType) => {
  if (err instanceof mongoose.Error.CastError
    || err instanceof mongoose.Error.ValidationError) {
    return new NewErrorType();
  }
  return err;
};

module.exports.middlewareErrorHandler = (err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500)
      .send({
        message: 'Во время обработки запроса произошла ошибка. Проверьте правильность запроса',
      });
  } else {
    next();
  }
};
