
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mealRouter = require(__dirname + '/routes/meal_router');
const errorHandler = require(__dirname + '/lib/error_handler');
const getData = require(__dirname + '/lib/get_data');

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Welcome to Next-Meal' });
});

app.use('/api', mealRouter);
app.use('/', (req, res) => {
  errorHandler(new Error('404 - Page Not Found'), res, 404);
});

module.exports = exports = function(port, mongoDbUri, cb) {

  mongoose.connection.on('open', () => {
    getData();
  });
  mongoose.connect(mongoDbUri);

  return app.listen(port, cb);
};
