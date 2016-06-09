module.exports = function(app) {
  require('./sign_up_controller')(app);
  require('./sign_in_controller')(app);
  require('./auth_controller')(app);
};
