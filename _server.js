
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mealRouter = require(__dirname + '/routes/meal_router');
const errorHandler = require(__dirname + '/lib/error_handler');
const storeData = require(__dirname + '/lib/store_data');
const twilioRouter = require(__dirname + '/routes/twiliorouter');

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Next-Meal!');
});

app.use('/api', twilioRouter);
app.use('/api', mealRouter);
app.use('/', (req, res) => {
  errorHandler(new Error('404 - Page Not Found'), res, 404);
});

module.exports = exports = function(port, mongoDbUri, cb) {
  mongoose.connection.on('open', () => {
    storeData();
  });
  mongoose.connect(mongoDbUri);
  return app.listen(port, cb);
};
