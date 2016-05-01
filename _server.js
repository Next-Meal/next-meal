
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mealRouter = require(__dirname + '/routes/mealRouter');

app.use('/api', mealRouter);
app.use((req, res) => {
  res.status(404).json({ msg: '404 - Page Not Found' });
});

module.exports = exports = function(port, mongoDbUri, cb) {
  mongoose.connect(mongoDbUri);
  return app.listen(port, cb);
};
