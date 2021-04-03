module.exports.thirdPartyLibErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(400)
      .send({
        message: 'Во время обработки запроса произошла ошибка. Проверьте правильность запроса',
      });
  } else {
    next();
  }
};

module.exports.secretKey = '4829756EA1464D5D756D7384D8996';
