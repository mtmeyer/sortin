angular.module('sortinApp').controller("CreateTopic", function($scope, $location, TopicService) {
  $('#fontInputErrorMsg').hide();
  PairService.getFonts().then(function(response) {
    $scope.fonts = response.data;
    $scope.fonts = $scope.fonts[0].items;
    $scope.fontNames = getFontNames($scope.fonts);
  });

  $scope.back = function() {
    $location.path("#/");
  }

  $scope.savePair = function(pair) {
    if ($scope.isPrimValid && $scope.isSecValid){
      pair.likes = 0;
      PairService.createPair(pair).then(function(doc) {
          $location.path("#/");
      }, function(response) {
          alert(response);
      });
    } else {
      $('#fontInputErrorMsg').show();
      console.log('Error Occurred, try again.');
    }
  }

  function getFontNames(fonts) {
    var arr = [];
    for (i = 0; i < fonts.length; i++) {
      arr.push(fonts[i].family.toLowerCase());
    }
    return arr;
  }

  $scope.validFont = function(res, font) {
    if (typeof res === 'undefined') {
      $('#' + font).addClass("inputInvalid");
      $('#fontInputErrorMsg').show();
      setValidFont(font, false);
    } else {
      var input = res.toLowerCase();
      if($scope.fontNames.indexOf(input) === -1) {
        setValidFont(font, false);
        $('#' + font).addClass("inputInvalid");
        $('#fontInputErrorMsg').show();
      } else {
        setValidFont(font, true);
        $('#fontInputErrorMsg').hide();
        if ($('#' + font).hasClass("inputInvalid")) {
          $('#' + font).removeClass("inputInvalid");
        }
      }
    }
  }

  function setValidFont(font, bool) {
    if (font === 'primFontInput') {
      $scope.isPrimValid = bool;
    } else if (font === 'secFontInput') {
      $scope.isSecValid = bool;
    }
  }

  $scope.headerSaveHover = function(state) {
    if (state === 'in') {
      $('#headerSaveBtn').attr('src', function(index, attr) {
        return attr.replace(".svg", "_hover.svg");
      });
    } else if (state === 'out') {
      $('#headerSaveBtn').attr('src', function(index, attr) {
        return attr.replace("_hover.svg", ".svg");
      });
    }
  }
});
