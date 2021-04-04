const jwt = require('jsonwebtoken');
// errors
const UnauthorizedError = require('../errors/UnauthorizedError');
// temp
const {secretKey} = require('../utils/utils');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
};
