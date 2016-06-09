const angular = require('angular');
const ngRoute = require('angular-route');
require('angular-simple-logger');
require('lodash');
require('angular-google-maps');
const nextMeal = angular.module('nextMeal', [ngRoute, 'uiGmapgoogle-maps']);
// const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_API_KEY = 'AIzaSyD2ozASwpbHKeG7e-5zyZbsaQN-dB1IP6s';

// require('./locations')(nextMeal);
// require('./services')(nextMeal);

nextMeal.config(['$routeProvider', 'uiGmapGoogleMapApiProvider',
  function($routeProvider, gmapProvider) {
    // $routeProvider
    //   .when('/', {
    //     templateUrl: 'templates/main_view.html',
    //     controller: 'LocationsController',
    //     controllerAs: 'locctrl'
    //   })
    //   .when('/locations', {
    //     templateUrl: 'templates/locations/views/locations.html',
    //     controller: 'LocationsController',
    //     controllerAs: 'locctrl'
    //   })
    //   .when('/signup', {
    //     templateUrl: 'templates/auth/views/auth_view.html',
    //     controller: 'SignUpController',
    //     controllerAs: 'authctrl'
    //   })
    //   .when('signin', {
    //     templateUrl: 'templates/auth/views/auth_view.html',
    //     controller: 'SignInController',
    //     controllerAs: 'authctrl'
    //   })
    //   .otherwise({
    //     redirectTo: '/'
    //   });
    gmapProvider
      .configure({
        key: GOOGLE_API_KEY,
        v: '3'
        // libraries: 'drawing,geometry,places'
      });
  }]);

nextMeal.controller('MapCtrl', function(uiGmapGoogleMapApi) {
  this.markers = [];
  // this.map = {
  //   center: {
  //     latitude: 45,
  //     longitude: -73
  //   },
  //   zoom: 8
  // };
  uiGmapGoogleMapApi.then(function(maps) {
    debugger;
    this.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };
  }.bind(this));
});
