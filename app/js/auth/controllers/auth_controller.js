module.exports = function(app) {
  app.controller('AuthController', ['nmAuth', '$location', function(auth, $location) {
    this.organizationName = '';
    this.errors = [];
    this.getOrganizationName = function() {
      auth.getOrganizationName()
      .then((currentOrganization) => {
        this.organizationName = currentOrganization;
      }, /* TODO: add error lib service here!!! Same as class!! */ );
    }.bind(this);

    this.logout = function() {
      auth.removeToken();
      this.organizationName = '';
      $location.path('/signin');
    }.bind(this);
  }]);
};
