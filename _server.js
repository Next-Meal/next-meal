const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mealRouter = require(__dirname + '/routes/meal_router');
const twilioRouter = require(__dirname + '/routes/twilio_router');
const userRouter = require(__dirname + '/routes/user_router');
const voiceRouter = require(__dirname + '/routes/voice_router');
const authRouter = require(__dirname + '/routes/auth_router');

app.use('/api', authRouter);
app.use('/voice', voiceRouter);
app.use('/api', userRouter);
app.use('/api', twilioRouter);
app.use('/api', mealRouter);
app.use(express.static('build'));

module.exports = exports = function(port, mongoDbUri, cb) {
  mongoose.connect(mongoDbUri);
  return app.listen(port, cb);
};
