module.exports = function(app) {
  app.directive('locationsList', function() {
    return {
      restrict: 'EAC',
      replace: true,
      require: '^ngController',
      transclude: true,
      templateUrl: '/templates/locations/directives/locations_list.html',
      scope: {
        location: '='
      },
      link: function(scope, element, attr, controller) {
        scope.store = controller.locationStore;
        scope.remove = controller.deleteLocation;
      }
    };
  });
};
