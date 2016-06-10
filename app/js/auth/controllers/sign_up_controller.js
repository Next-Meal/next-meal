var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('SignUpController', ['$http', '$location', 'handleError', 'nmAuth',
  function($http, $location, handleErr, auth) {
    this.signup = true;
    this.errors = [];
    this.buttonText = 'Create New Organization';
    this.authenticate = function(organization) {
      $http.post(baseUrl + '/api/signup', organization)
      .then((res) => {
        auth.saveToken(res.data.token);
        auth.getOrganizationName();
        $location.path('/organization_meals');
      }, handleErr(this.errors, 'could not create user'));
    };
  }]);
};
