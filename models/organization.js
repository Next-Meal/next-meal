const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


var organizationSchema = new mongoose.Schema({
  organizationName: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  address: { type: String },
  password: { type: String, required: true },
  findHash: { type: String }
});
organizationSchema.methods.generateHash = function(password) {
  return this.password = bcrypt.hashSync(password, 8);
};
organizationSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

organizationSchema.methods.generateFindHash = function(cb) {
  var tries = 0;
  var timeout;
  var _generateFindHash = () => {
    var hash = crypto.randomBytes(32);
    this.findHash = hash.toString('hex');
    // eslint-disable-next-line
    this.save((err, data) => {
      if (err) {
        if (tries > 9) {
          return cb(new Error('could not generate hash'));

        }
        return timeout = setTimeout(() => {
          _generateFindHash();
          tries++;
        }, 1000);
      }
      if (timeout) clearTimeout(timeout);
      cb(null, hash.toString('hex'));
    });
  };
  _generateFindHash();
};
organizationSchema.methods.generateToken = function(cb) {
  this.generateFindHash(function(err, hash) {
    if (err) return cb(err);
    cb(null, jwt.sign({ idd: hash }, process.env.APP_SECRET));
  });
};

module.exports = exports = mongoose.model('Organization', organizationSchema);
