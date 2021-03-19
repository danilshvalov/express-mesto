class IncorrectCardData extends Error {
  constructor() {
    super();
    this.name = 'IncorrectCardData';
    this.message = 'Переданы некорректные данные карточки';
  }
}

module.exports = IncorrectCardData;
