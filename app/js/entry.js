const angular = require('angular');
const nextMeal = angular.module('nextMeal', [require('angular-route')]);

require('./auth')(nextMeal);
require('./locations')(nextMeal);
require('./services')(nextMeal);

nextMeal.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/main_view.html',
      controller: 'LocationsController',
      controllerAs: 'locctrl'
    })
    .when('/locations', {
      templateUrl: 'templates/locations/views/locations.html',
      controller: 'LocationsController',
      controllerAs: 'locctrl'
    })
    .when('/signup', {
      templateUrl: 'templates/auth/views/auth_view.html',
      controller: 'SignUpController',
      controllerAs: 'authctrl'
    })
    .when('/signin', {
      templateUrl: 'templates/auth/views/auth_view.html',
      controller: 'SignInController',
      controllerAs: 'authctrl'
    })
    .when('/about', {
      templateUrl: 'templates/locations/views/about.html',
      controller: 'LocationsController',
      controllerAs: 'locctrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
