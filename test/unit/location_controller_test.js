var angular = require('angular');
require('angular-mocks');

describe('location controller', function() {
  var $controller;
  var $scope;
  var baseUrl = 'http://localhost:5000/api/meals';

  beforeEach(angular.mock.module('nextMeal'));

  beforeEach(angular.mock.inject(function(_$controller_, $rootScope) {
    $controller = _$controller_;
    $scope = $rootScope.$new();
  }));

  it('should be a controller', function() {
    var locctrl = $controller('LocationsController', { $scope });
    expect(typeof locctrl).toBe('object');
    expect(typeof locctrl.getAll).toBe('function');
  });

  describe('REST functions', function() {
    var $httpBackend;
    var locctrl;

    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      locctrl = $controller('LocationsController', { $scope });
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should send POST requests for locations', function() {
      $httpBackend.expectPOST(baseUrl, { location: 'test' }).respond(200, { location: 'other' });
      expect(locctrl.locations.length).toBe(0);
      locctrl.newLocation = { location: 'test' };
      locctrl.createLocation();
      $httpBackend.flush();
      expect(locctrl.locations[0].location).toBe('other');
      expect(locctrl.newLocation).toBe(null);
      expect(locctrl.errors.length).toBe(0);
    });

    it('should send GET requests for locations', function() {
      var testLocation = [{ location: 'test' }];
      $httpBackend.expectGET(baseUrl).respond(200, testLocation);
      locctrl.results = false;
      locctrl.getAll();
      $httpBackend.flush();
      expect(locctrl.locations.length).toBe(1);
      expect(locctrl.locations[0].location).toBe('test');
      expect(locctrl.errors.length).toBe(0);
      expect(locctrl.results).toBe(true);
    });

    it('should update location on PUT', function() {
      locctrl.locations = [{ location: 'test', editing: true, _id: 1 }];
      $httpBackend.expectPUT(baseUrl + '/1',
        { location: 'update test', editing: true, _id: 1 }).respond(200);
      locctrl.locations[0].location = 'update test';
      locctrl.updateLocation(locctrl.locations[0]);
      $httpBackend.flush();
      expect(locctrl.locations[0].editing).toBe(false);
      expect(locctrl.errors.length).toBe(0);
    });

    it('should remove locations on DELETE', function() {
      $httpBackend.expectDELETE(baseUrl + '/1').respond(200);
      var testLocation = { location: 'test', _id: 1 };
      locctrl.locations.push(testLocation);
      locctrl.removeLocation(locctrl.locations[0]);
      $httpBackend.flush();
      expect(locctrl.locations.length).toBe(0);
      expect(locctrl.errors.length).toBe(0);
    });
  });
});
