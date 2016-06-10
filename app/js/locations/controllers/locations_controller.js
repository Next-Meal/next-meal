const angular = require('angular');

module.exports = function(app) {
  app.controller('LocationsController', ['Resource', 'uiGmapGoogleMapApi',
    function(Resource, gmapApi) {
      this.locations = [];
      this.errors = [];
      this.master = {};
      this.markers = [];
      this.searchText = '';
      this.results = false;
      this.locationErrors = {
        getAll: 'could not get locations',
        update: 'could not update locations',
        remove: 'could not delete locations',
        create: 'could not post to locations'
      };
      var remote = new Resource(this.locations, this.errors,
        '/api/meals', { errMessages: this.locationErrors });

      var setMarkers = function() {
        var marker;

        for (var i = 0; i < this.locations.length; i++) {
          if (this.locations[i].coordinates) {
            marker = {
              latitude: this.locations[i].coordinates.lat,
              longitude: this.locations[i].coordinates.lng,
              id: i,
              icon: './images/map_icon.png',
              options: {
                title: this.locations[i].name_of_program
              }
            };
            this.markers.push(marker);
          }
        }
      }.bind(this);

      this.getAll = function() {
        remote.getAll()
        .then(() => {
          this.results = true;
          setMarkers();
        });
      }.bind(this);

      this.createLocation = function() {
        remote.create(this.newLocation)
          .then(() => {
            this.newLocation = null;
            setMarkers();
          });
      }.bind(this);

      this.updateLocation = function(location) {
        remote.update(location)
          .then(() => {
            location.editing = false;
            this.master = angular.copy(location);
            setMarkers();
          });
      }.bind(this);

      this.removeLocation = remote.remove.bind(remote);

      this.locationStore = function(location) {
        this.master = angular.copy(location);
      };

      this.locationReset = function(location) {
        var oldLocation = this.locations[this.locations.indexOf(location)];
        angular.copy(this.master, oldLocation);
      };

      this.reset = function() {
        this.searchText = '';
      };

      gmapApi.then(function(maps) {
        maps.visualRefresh = true;
        this.map = {
          center: {
            latitude: 47.610019,
            longitude: -122.339156
          },
          zoom: 13
        };
        this.options = {
          scrollwheel: false
        };
      }.bind(this));
    }]);
};
