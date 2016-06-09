var baseUrl = require('../../config').baseUrl;

module.exports = function(app) {
  app.controller('LocationsController', ['Resource', function(Resource) {
    this.locations = [];
    this.errors = [];
    this.master = {};
    this.results = false;
    this.searchText = '';
    this.locationErrors = {
      getAll: 'could not get locations',
      update: 'could not update locations',
      remove: 'could not delete locations',
      create: 'could not post to locations'
    };
    var remote = new Resource(this.locations, this.errors,
      baseUrl + '/api/meals', { errMessages: this.locationErrors });

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
    };

    this.locationReset = function(location) {
      var oldLocation = this.locations[this.locations.indexOf(location)];
      angular.copy(this.master, oldLocation);
    }.bind(this);

    this.reset = function() {
      this.searchText = null;
    };
  }]);
};
