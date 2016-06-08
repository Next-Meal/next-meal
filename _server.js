const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mealRouter = require(__dirname + '/routes/meal_router');
const twilioRouter = require(__dirname + '/routes/twilio_router');
const userRouter = require(__dirname + '/routes/user_router');
const voiceRouter = require(__dirname + '/routes/voice_router');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use('/voice', voiceRouter);
app.use('/api', userRouter);
app.use('/api', twilioRouter);
app.use('/api', mealRouter);
app.use(express.static('build'));

module.exports = exports = function(port, mongoDbUri, cb) {
  mongoose.connect(mongoDbUri);
  return app.listen(port, cb);
};
