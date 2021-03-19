class IncorrectAvatarData extends Error {
  constructor(props) {
    super(props);
    this.name = 'IncorrectAvatarData';
    this.message = 'Переданы некорректные данные аватара';
  }
}

module.exports = IncorrectAvatarData;
