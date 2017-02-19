angular.module('fontPairApp').service("PairService", function($http) {
  this.getPairs = function() {
      return $http.get("/pairs").
          then(function(response) {
              return response;
          }, function(response) {
              alert("Error finding pairs.");
          });
  }
  this.createPair = function(pair) {
      return $http.post("/pairs", pair).
          then(function(response) {
              return response;
          }, function(response) {
              alert("Error creating pair.");
          });
  }
  this.addLike = function(pair) {
    var url = "/pairs/" + pair._id;
      return $http.put(url, pair).
          then(function(response) {
              return response;
          }, function(response) {
              console.log("Error adding like.");
          });
  }
  this.getFonts = function() {
    return $http.get("/fonts").
        then(function(response) {
            return response;
        }, function(response) {
            alert("Error finding fonts.");
        });
  }

});
