// libs
const mongoose = require('mongoose');
// errors
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        return /\b((http|https):\/\/?)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/g.test(
          v,
        );
      },
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// проверяем права пользователя, если все хорошо - возвращаем id карты
cardSchema.statics.deleteCardAsOwner = function ({cardId, userId}) {
  if (!cardId || !userId) {
    throw new BadRequestError('Переданы некорректные данные для удаления карточки');
  }
  return this.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с id «${cardId}» не найдена`);
      }
      if (card.owner !== userId) {
        throw new ForbiddenError(
          'У вас недостаточно прав для удаления этой карточки',
        );
      }
      return this.findByIdAndDelete(cardId);
    });
};

module.exports = mongoose.model('card', cardSchema);
