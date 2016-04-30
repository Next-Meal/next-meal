
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use((req, res) => {
  res.status(404).json({ msg: '404 - Page Not Found' });
});

module.exports = exports = function(port, mongoDbUri, cb) {
  mongoose.connect(mongoDbUri);
  return app.listen(port, cb);
};
