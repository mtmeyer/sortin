angular.module('sortinApp').controller("TopicController", function($scope, TopicService) {

  TopicService.getTopics().then(function(response) {
    $scope.allTopics = response.data;
  });

});
