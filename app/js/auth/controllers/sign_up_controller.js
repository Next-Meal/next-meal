var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('SignUpController', ['$http', '$location', 'nmAuth', function($http, $location, auth) { /* TODO: ADD errorHandler service!!! */
    this.signup = true;
    // this.errors = [];  TODO: add errorHandler service
    this.buttonText = 'Create New Organization';
    this.authenticate = function(organization) {
      $http.post(baseUrl + '/api/signup', organization)
      .then((res) => {
        auth.saveToken(res.data.token);
        auth.getOrganizationName();
        $location.path('/org_locations') // TODO: path is not correct, fix this!! Finish org router!!
      }, /* TODO: ADD handleError service here! */ );
    };
  }]);
};
