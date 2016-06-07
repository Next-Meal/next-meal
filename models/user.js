const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  phone_number: { type: Number, unique: true }
});

module.exports = exports = mongoose.model('usersInNeed', userSchema);
