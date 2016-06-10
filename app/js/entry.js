const angular = require('angular');
const ngRoute = require('angular-route');
require('angular-simple-logger');
require('lodash');
require('angular-google-maps');
const nextMeal = angular.module('nextMeal', [ngRoute, 'uiGmapgoogle-maps']);

require('./auth')(nextMeal);
require('./locations')(nextMeal);
require('./services')(nextMeal);

nextMeal.config(['$routeProvider', 'uiGmapGoogleMapApiProvider',
  function($routeProvider, gmapProvider) {
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
      .when('/about', {
        templateUrl: 'templates/locations/views/about.html',
        controller: 'LocationsController',
        controllerAs: 'locctrl'
      })
      .when('/organization', {
        templateUrl: 'templates/locations/views/org_view.html',
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
      .otherwise({
        redirectTo: '/'
      });
    gmapProvider
      .configure({
        key: 'AIzaSyD2ozASwpbHKeG7e-5zyZbsaQN-dB1IP6s',
        v: '3',
        libraries: 'drawing,geometry,places'
      });
  }]);
