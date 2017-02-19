angular.module('fontPairApp').controller("MainController", function($scope, PairService) {

  $scope.$on('onRepeatLast', function(scope, element, attrs){
    console.log('loaded');
    $('#loadingOverlay').addClass('loadingFalse');
    $('#loadingOverlay').removeClass('loadingTrue');
  });

  PairService.getPairs().then(function(response) {
    $scope.pairs = response.data;
    if ($scope.pairs.length === 0) {
      $scope.documentsPresent = false;
      $('#mainContentContainer').addClass('emptyState');
      $('#dropdownContainer').addClass('displayNone');
      $('#loadingOverlay').addClass('loadingFalse');
      $('#loadingOverlay').removeClass('loadingTrue');
    } else {
      $scope.documentsPresent = true;
    }
  });
  $scope.selectedFilter = 'Recent';

  $scope.headerAddHover = function(state) {
    if (state === 'in') {
      $('#headerAddBtn').attr('src', function(index, attr) {
        return attr.replace(".svg", "_hover.svg");
      });
    } else if (state === 'out') {
      $('#headerAddBtn').attr('src', function(index, attr) {
        return attr.replace("_hover.svg", ".svg");
      });
    }
  }

  $scope.filterChange = function(filter) {
    if (filter === 'recent') {
      $scope.selectedFilter = 'Recent';
      $('#likedFilterBtn').removeClass('filterSelected');
      $('#likedFilterBtn').addClass('filterUnselected');
      $('#recentFilterBtn').addClass('filterSelected');
    } else if (filter === 'liked') {
      $scope.selectedFilter = 'Most Liked';
      $('#recentFilterBtn').removeClass('filterSelected');
      $('#recentFilterBtn').addClass('filterUnselected');
      $('#likedFilterBtn').addClass('filterSelected');
    }
  }

  $scope.addLike = function(pair) {
    console.log(pair.likes);
    pair.likes = pair.likes + 1;
    console.log(pair.likes)
      PairService.addLike(pair).then(function(doc) {
      }, function(response) {
          alert(response);
      });
  }
});
