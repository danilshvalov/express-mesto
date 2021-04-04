// models
const Card = require('../models/cards');
// errors
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({}).populate('owners', 'likes').then((data) => {
    res.send(data);
  }).catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const {cardId} = req.params;
  Card.deleteCardAsOwner({cardId, userId: req.user._id})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const {cardId} = req.params;
  Card.findByIdAndUpdate(cardId, {$addToSet: {likes: req.user._id}},
    {new: true}).then((data) => {
    if (!data) {
      throw new NotFoundError(`Карточка с id «${cardId}» не найдена`);
    }
    res.send(data);
  }).catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const {cardId} = req.params;
  Card.findByIdAndUpdate(
    cardId,
    {$pull: {likes: req.user._id}},
    {new: true},
  ).then((data) => {
    if (!data) {
      throw new NotFoundError(`Карточка с id «${cardId}» не найдена`);
    }
    res.send(data);
  }).catch(next);
};
