const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// models
const User = require('../models/user');
// errors
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const InternalServerError = require('../errors/InternalServerError');
// temp
const {secretKey} = require('../utils/utils');

// constants
const updateParams = {new: true, runValidators: true, upsert: true};
const tokenDuration = 1000 * 3600 * 24 * 7; // 1 неделя
//                     1000ms->1h->24h->7d

// controllers
const getUserById = (userId) => User.findById(userId)
  .catch(() => {
    throw new BadRequestError(
      'Переданы некорректные данные для получения пользователя',
    );
  });

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const {userId} = req.params;
  getUserById(userId).then((data) => {
    if (!data) {
      throw new NotFoundError(`Пользователь с id «${userId}» не найден`);
    }
    res.send(data);
  }).catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  getUserById(userId).then((data) => {
    // если каким-то чудом пользователя с id текущего пользователя не существует
    // бросаем ошибку сервера ¯\_(ツ)_/¯
    if (!data) {
      throw new InternalServerError('Произошла непредвиденная ошибка');
    }
    res.send(data);
  }).catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then(({_id}) => {
      res.send({
        _id,
        name,
        about,
        avatar,
        email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные для создания пользователя',
        );
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError(`Пользователь с email «${email}» уже существует`);
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about},
    updateParams)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные для обновления профиля',
        );
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar},
    updateParams)
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        {_id: user._id},
        secretKey,
        {expiresIn: tokenDuration},
      );

      res
        .cookie('jwt', token, {
          maxAge: tokenDuration,
          httpOnly: true,
          sameSite: true,
        })
        .send({token});
    })
    .catch(next);
};
