angular.module('fontPairApp', ['ngRoute']).config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "main.html",
            controller: "MainController"
        })
        .when("/new/pair", {
            controller: "CreatePair",
            templateUrl: "create-pair.html"
        })
        .otherwise({
            redirectTo: "/"
        })
})
.directive('repeatDone', function() {
  return function(scope, element, attrs) {
    if (scope.$last) setTimeout(function(){
      scope.$emit('onRepeatLast', element, attrs);
    }, 1);
  };
});
