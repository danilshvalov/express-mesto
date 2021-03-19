class CardIdNotFound extends Error {
  constructor() {
    super();
    this.name = 'CardIdNotFound';
    this.message = 'Карточка с указанным _id не найдена';
  }
}

module.exports = CardIdNotFound;
