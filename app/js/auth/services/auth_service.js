/* eslint no-undef:0 no-unused-expressions:0 */
var baseUrl = require('../../config').baseUrl;

module.exports = function(app) {
  app.factory('nmAuth', ['$http', '$q', function($http, $q) {
    return {
      removeToken: function() {
        this.token = null;
        this.organizationName = null;
        $http.defaults.headers.common.token = null;
        window.localStorage.token = '';
      },
      saveToken: function(token) {
        this.token = token;
        $http.defaults.headers.common.token = token;
        window.localStorage.token = token;
        return token;
      },
      getToken: function() {
        this.token || this.saveToken(window.localStorage.token);
        return this.token;
      },
      getOrganizationName: function() {
        return $q(function(resolve, reject) {
          if (this.organizationName) return resolve(this.organizationName);
          if (!this.getToken()) return reject(new Error('no auth token exists'));

          $http.get(baseUrl + '/api/profile')
          .then((res) => {
            this.organizationName = res.data.organizationName;
            resolve(res.data.organizationName);
          }, reject);
        }.bind(this));
      }
    };
  }]);
};
