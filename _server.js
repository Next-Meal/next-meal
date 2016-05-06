
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mealRouter = require(__dirname + '/routes/meal_router');
const twilioRouter = require(__dirname + '/routes/twilio_router');
const errorHandler = require(__dirname + '/lib/error_handler');
const userRouter = require(__dirname + '/routes/user_router');
const voiceRouter = require(__dirname + '/routes/voice_router');

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Next-Meal!');
});

app.use('/voice', voiceRouter);
app.use('/api', userRouter);
app.use('/api', twilioRouter);
app.use('/api', mealRouter);
app.use('/', (req, res) => {
  errorHandler(new Error('404 - Page Not Found'), res, 404);
  console.log(404);
});

module.exports = exports = function(port, mongoDbUri, cb) {
  mongoose.connect(mongoDbUri);
  return app.listen(port, cb);
};
