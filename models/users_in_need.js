/* eslint-disable camelcase */

const mongoose = require('mongoose');

var userInNeedSchema = new mongoose.Schema({
  phone_number: { type: Number, unique: true }
});

module.exports = exports = mongoose.model('usersInNeed', userInNeedSchema);
