module.exports = function(app) {
  app.factory('handleError', function() {
    return function(errArray, message) {
      return function(err) {
        console.log(err);
        if (Array.isArray(errArray)) {
          errArray.push(new Error(message || 'server error'));
          console.log(message);
        }
      };
    };
  });
};
