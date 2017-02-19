angular.module('sortinApp').service("TopicService", function($http) {
  this.getTopics = function() {
      return $http.get("/topics").
          then(function(response) {
              return response;
          }, function(response) {
              alert("Error finding topics.");
          });
  }

  this.getTopic = function(topicId) {
        var url = "/topics/" + topicId;
        console.log(topicId);
        return $http.get(url).
            then(function(response) {
                return response;
            }, function(response) {
                alert("Error finding this topic.");
            });
    }

});
