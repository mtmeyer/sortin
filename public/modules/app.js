angular.module('sortinApp', ['ngRoute']).config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "topic.html",
            controller: "TopicController"
        })
        .when("/new/topic", {
            controller: "CreateTopic",
            templateUrl: "create-topic.html"
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
