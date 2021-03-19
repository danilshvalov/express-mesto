const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {middlewareErrorHandler} = require('./utils/utils');

const {PORT = 3000} = process.env;
const devId = '605130289b8e22245856761f';

const app = express();

// В случае неправильного JSON запроса ошибка не пролезет пользователю.
// Ошибка останется на стороне сервера

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(middlewareErrorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: devId,
  };

  next();
});

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404)
    .send({message: 'Ничего не найдено. Проверьте путь и метод запроса'});
});

app.listen(PORT);
