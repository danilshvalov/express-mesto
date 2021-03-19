class IncorrectProfileData extends Error {
  constructor() {
    super();
    this.name = 'IncorrectProfileData';
    this.message = 'Переданы некорректные данные для профиля';
  }
}

module.exports = IncorrectProfileData;
