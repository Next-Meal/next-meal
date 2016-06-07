module.exports = function(app) {
  app.factory('Resource', ['$http', 'handleError', function($http, handleError) {

    var Resource = function(resourceArr, errArr, baseUrl, options) {
      if (!this instanceof Resource) {
        return new Resource.apply(null, arguments); // eslint-disable-line
      }
      this.data = resourceArr;
      this.url = baseUrl;
      this.options = options || {};
      this.options.errMessages = this.options.errMessages || {};
    };

    Resource.prototype.getAll = function() {
      return $http.get(this.url)
        .then((res) => {
          this.data.splice(0);
          for (var i = 0; i < res.data.length; i++) {
            this.data.push(res.data[i]);
          }
        }, handleError(this.errors, this.options.errMessages.getAll || 'could not GET resource'));
    };

    Resource.prototype.create = function(resource) {
      return $http.post(this.url, resource)
        .then((res) => {
          this.data.push(res.data);
        }, handleError(this.errors, this.options.errMessages.create || 'could not POST resource'));
    };

    Resource.prototype.update = function(resource) {
      return $http.put(this.url + '/' + resource._id, resource)
        .catch(handleError(this.errors, this.options.errMessages.update ||
          'could not UPDATE resource'));
    };

    Resource.prototype.remove = function(resource) {
      return $http.delete(this.url + '/' + resource._id, resource)
        .then(() => {
          this.data.splice(this.data.indexOf(resource), 1);
        }, handleError(this.errors, this.options.errMessages.remove ||
          'could not DELETE resource'));
    };

    return Resource;
  }]);
};
