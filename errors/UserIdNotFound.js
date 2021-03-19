class UserIdNotFound extends Error {
  constructor() {
    super();
    this.name = 'UserIdNotFound';
    this.message = 'Пользователь по указанному _id не найден';
  }
}

module.exports = UserIdNotFound;
