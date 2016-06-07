const angular = require('angular');

describe('handle error service', function() {
  var handleError;
  beforeEach(angular.mock.module('nextMeal'));

  it('should return a function', angular.mock.inject(function(handleError) {
    expect(typeof handleError).toBe('function');
  }));

  it('should add an error to the error array', angular.mock.inject(function(handleError) {
    var testErrArr = [];
    handleError(testErrArr, 'test error')();
    console.log(testErrArr);
    expect(testErrArr.length).toBe(1);
    expect(testErrArr[0] instanceof Error).toBe(true);
    expect(testErrArr[0].message).toBe('test error');
  }));
});
