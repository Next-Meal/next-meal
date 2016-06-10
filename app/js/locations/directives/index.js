module.exports = function(app) {
  require('./locations_list')(app);
  require('./location_form')(app);
};
