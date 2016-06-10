const mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
  day_time: { type: String },
  location: { type: String },
  meal_served: { type: String },
  name_of_program: { type: String },
  people_served: { type: String },
  zip_code: { type: String },
  daysOpen: { type: Object },
  wranglerId: { type: String }
});

module.exports = exports = mongoose.model('location', locationSchema);
