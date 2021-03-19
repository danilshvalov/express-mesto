const Card = require('../models/cards');
const IncorrectCardData = require('../errors/IncorrectCardData');
const IncorrectLikeData = require('../errors/IncorrectLikeData');
const CardIdNotFound = require('../errors/CardIdNotFound');
const IncorrectCardId = require('../errors/IncorrectCardId');
const {dispatchError} = require('../utils/utils');

const dispatchLikeDataError = (err) => dispatchError(err, IncorrectLikeData);
const dispatchCardDataError = (err) => dispatchError(err, IncorrectCardData);
const dispatchCardIdError = (err) => dispatchError(err, IncorrectCardId);

const parseError = (err) => {
  const {message} = err;
  if (err instanceof IncorrectLikeData
    || err instanceof IncorrectCardData
    || err instanceof IncorrectCardId) {
    return {code: 400, message};
  }
  if (err instanceof CardIdNotFound) {
    return {code: 404, message};
  }
  return {code: 500, message};
};

module.exports.validateCardId = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(new CardIdNotFound()).then(() => {
    next();
  }).catch((err) => {
    const {code, message} = parseError(dispatchCardIdError(err));
    res.status(code).send({message});
  });
};

module.exports.getCards = (req, res) => {
  Card.find({}).populate('owners', 'likes').then((data) => {
    res.send(data);
  }).catch((err) => {
    const {code, message} = parseError(err);
    res.status(code).send({message});
  });
};

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      const {code, message} = parseError(dispatchCardDataError(err));
      res.status(code).send({message});
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      const {code, message} = parseError(dispatchCardDataError(err));
      res.status(code).send({message});
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: req.user._id}},
    {new: true}).then((data) => {
    res.send(data);
  }).catch((err) => {
    const {code, message} = parseError(dispatchLikeDataError(err));
    res.status(code).send({message});
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true},
  ).then((data) => {
    res.send(data);
  }).catch((err) => {
    const {code, message} = parseError(dispatchLikeDataError(err));
    res.status(code).send({message});
  });
};
