module.exports = function(app) {
  // eslint-disable-next-line
  app.controller('AuthController', ['nmAuth', 'handleError', '$location', function(auth, handleErr, $location) {
    this.organizationName = '';
    this.errors = [];
    this.getOrganizationName = function() {
      auth.getOrganizationName()
      .then((currentOrganization) => {
        this.organizationName = currentOrganization;
      }, handleErr(this.errors, 'could not get organization'));
    }.bind(this);

    this.logout = function() {
      auth.removeToken();
      this.organizationName = '';
      $location.path('/signin');
    }.bind(this);
  }]);
};
