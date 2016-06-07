const angular = require('angular');

describe('resource service', function() {
  var $httpBackend;
  var baseUrl = 'http://localhost:5000/api/meals';

  beforeEach(angular.mock.module('nextMeal'));

  beforeEach(angular.mock.inject(function(_$httpBackend_) {
    $httpBackend = _$httpBackend_;
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should return a function', angular.mock.inject(function(Resource) {
    expect(typeof Resource).toBe('function');
    var testResource = new Resource();
    expect(typeof testResource.getAll).toBe('function');
    expect(typeof testResource.create).toBe('function');
    expect(typeof testResource.update).toBe('function');
    expect(typeof testResource.remove).toBe('function');
  }));

  it('should have GET functionality', angular.mock.inject(function(Resource) {
    $httpBackend.expectGET(baseUrl).respond(200, [{ location: 'test' }]);
    var testArr = [];
    var errorArr = [];
    var testResource = new Resource(testArr, errorArr, baseUrl);
    testResource.getAll();
    $httpBackend.flush();

    expect(testArr.length).toBe(1);
    expect(testArr[0].location).toBe('test');
  }));

  it('should have UPDATE functionality', angular.mock.inject(function(Resource, $q) {
    var testLocation = { location: 'not test', _id: 1 };
    var testArr = [testLocation];
    var errorArr = [];
    var resource = new Resource(testArr, errorArr, baseUrl);
    $httpBackend.expectPUT(baseUrl + '/1', testLocation).respond(200);
    var result = resource.update(testLocation);
    $httpBackend.flush();

    expect(errorArr.length).toBe(0);
    expect(result instanceof $q).toBe(true);
  }));

  it('should have POST functionality', angular.mock.inject(function(Resource) {
    var testLocation = { location: 'test' };
    $httpBackend.expectPOST(baseUrl, testLocation)
      .respond(200, { location: 'another test', _id: 0 });
    var testArr = [];
    var errorArr = [];
    var resource = new Resource(testArr, errorArr, baseUrl);
    resource.create(testLocation);
    $httpBackend.flush();

    expect(testArr.length).toBe(1);
    expect(errorArr.length).toBe(0);
    expect(testArr[0].location).toBe('another test');
  }));

  it('should have DELETE functionality', angular.mock.inject(function(Resource) {
    var testLocation = { location: 'test', _id: 1 };
    var testArr = [testLocation];
    var errorArr = [];
    $httpBackend.expectDELETE(baseUrl + '/1').respond(200);
    var resource = new Resource(testArr, errorArr, baseUrl);
    resource.remove(testLocation);
    $httpBackend.flush();

    expect(testArr.length).toBe(0);
  }));
});
