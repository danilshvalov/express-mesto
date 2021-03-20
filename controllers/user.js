const User = require('../models/user');
const UserIdNotFound = require('../errors/UserIdNotFound');
const IncorrectUserId = require('../errors/IncorrectUserId');
const IncorrectProfileData = require('../errors/IncorrectProfileData');
const IncorrectAvatarData = require('../errors/IncorrectAvatarData');
const {dispatchError} = require('../utils/utils');

const updateParams = {new: true, runValidators: true, upsert: true};

const dispatchUserIdError = (err) => dispatchError(err, IncorrectUserId);
const dispatchProfileDataError = (err) => dispatchError(err,
  IncorrectProfileData);
const dispatchAvatarDataError = (err) => dispatchError(err,
  IncorrectAvatarData);

const parseError = (err) => {
  const {message} = err;
  if (err instanceof IncorrectProfileData
    || err instanceof IncorrectAvatarData
    || err instanceof IncorrectUserId) {
    return {code: 400, message};
  }
  if (err instanceof UserIdNotFound) {
    return {code: 404, message};
  }
  return {code: 500, message};
};

// Ограничиваем количество возвращаемых ключей
// чтобы клиент получал только то, что нужно

const getUserData = ({
  name,
  about,
  avatar,
  _id,
}) => (
  {
    name,
    about,
    avatar,
    _id,
  });

module.exports.validateUserId = async (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new UserIdNotFound())
    .then(() => {
      next();
    })
    .catch((err) => {
      const {code, message} = parseError(dispatchUserIdError(err));
      res.status(code).send({message});
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data.map((item) => (getUserData(item))));
    })
    .catch((err) => {
      const {code, message} = parseError(err);
      res.status(code).send({message});
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((data) => {
      res.send(getUserData(data));
    })
    .catch((err) => {
      const {code, message} = parseError(err);
      res.status(code).send({message});
    });
};

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((data) => {
      res.send(getUserData(data));
    })
    .catch((err) => {
      const {code, message} = parseError(dispatchProfileDataError(err));
      res.status(code).send({message});
    });
};

module.exports.updateProfile = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about},
    updateParams)
    .then((data) => {
      res.send(getUserData(data));
    })
    .catch((err) => {
      const {code, message} = parseError(dispatchProfileDataError(err));
      res.status(code).send({message});
    });
};

module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar},
    updateParams)
    .then((data) => {
      res.send(getUserData(data));
    })
    .catch((err) => {
      const {code, message} = parseError(dispatchAvatarDataError(err));
      res.status(code).send({message});
    });
};
