module.exports = function(app) {
  require('./services')(app);
  require('./controllers')(app);
};
