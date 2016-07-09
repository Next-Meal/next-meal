const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  phone_number: { type: Number, unique: true }
});
//naming scheme is different in your model than anywhere else
module.exports = exports = mongoose.model('usersInNeed', userSchema);
