class IncorrectLikeData extends Error {
  constructor() {
    super();
    this.name = 'IncorrectLikeData';
    this.message = 'Переданы некорректные данные для постановки/снятии лайка';
  }
}

module.exports = IncorrectLikeData;
