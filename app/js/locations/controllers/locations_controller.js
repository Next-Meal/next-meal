const angular = require('angular');

module.exports = function(app) {
  app.controller('LocationsController', ['$scope', 'Resource', 'uiGmapGoogleMapApi',
    function($scope, Resource, gmapApi) {
      $scope.markers = [];
      this.locations = [];
      this.errors = [];
      this.master = {};
      this.results = false;
      this.locationErrors = {
        getAll: 'could not get locations',
        update: 'could not update locations',
        remove: 'could not delete locations',
        create: 'could not post to locations'
      };
      var remote = new Resource(this.locations, this.errors,
        '/api/meals', { errMessages: this.locationErrors });

      this.getAll = function() {
        remote.getAll()
        .then(() => {
          this.results = true;
        });
      }.bind(this);

      this.createLocation = function() {
        remote.create(this.newLocation)
          .then(() => {
            this.newLocation = null;
          });
      }.bind(this);

      this.updateLocation = function(location) {
        remote.update(location)
          .then(() => {
            location.editing = false;
            this.master = angular.copy(location);
          });
      }.bind(this);

      this.removeLocation = remote.remove.bind(remote);

      this.locationStore = function(location) {
        this.master = angular.copy(location);
      }.bind(this);

      this.locationReset = function(location) {
        var oldLocation = this.locations[this.locations.indexOf(location)];
        angular.copy(this.master, oldLocation);
      }.bind(this);

      gmapApi.then((maps) => {
        maps.visualRefresh = true;
        $scope.map = {
          center: {
            latitude: 47.620019,
            longitude: -122.349156
          },
          zoom: 16
        };
      });
    }]);
};
