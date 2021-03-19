class IncorrectUserId extends Error {
  constructor() {
    super();
    this.name = 'IncorrectUserId';
    this.message = 'Указан некорректный _id пользователя';
  }
}

module.exports = IncorrectUserId;
