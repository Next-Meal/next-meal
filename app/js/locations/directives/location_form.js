module.exports = function(app) {
  app.directive('locationForm', function() {
    return {
      restrict: 'EAC',
      require: '^ngController',
      transclude: true,
      templateUrl: '/templates/locations/directives/location_form.html',
      scope: {
        location: '=',
        buttonText: '@',
        saveMethod: '@'
      },
      link: function(scope, element, attrs, controller) {
        var actions = {
          update: controller.updateLocation,
          create: controller.createLocation
        };
        scope.save = actions[scope.saveMethod];
      }
    };
  });
};
