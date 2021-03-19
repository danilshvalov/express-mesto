class IncorrectCardId extends Error {
  constructor() {
    super();
    this.name = 'IncorrectCardId';
    this.message = 'Указан некорректный _id карточки';
  }
}

module.exports = IncorrectCardId;
