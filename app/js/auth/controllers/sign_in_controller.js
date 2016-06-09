/* eslint max-len:0 no-undef:0 */
var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('SignInController',
  ['$http', '$location', 'handleError', 'nmAuth',
  function($http, $location, handleErr, auth) {
    this.buttonText = 'Sign in to your Organization';
    this.errors = [];
    this.authenticate = function(organization) {
      $http({
        method: 'GET',
        url: baseUrl + '/api/signin',
        headers: {
          'Authorization': 'Basic ' + window.btoa(organization.organizationName + ':' + organization.password)
        }
      })
      .then((res) => {
        auth.saveToken(res.data.token);
        auth.getOrganizationName();
        $location.path('/organization_meals');
      }, handleErr(this.errors, 'could not sign into organization'));
    };
  }]);
};
