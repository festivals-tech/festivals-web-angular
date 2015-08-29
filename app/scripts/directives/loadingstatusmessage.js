'use strict';

/**
 * @ngdoc directive
 * @name festivalsWebApp.directive:loadingStatusMessage
 * @description
 * # loadingStatusMessage
 */
angular.module('festivalsWebApp')
  .directive('loadingStatusMessage', function () {
    return {
      link: function ($scope, $element, attrs) {
        var show = function () {
          $element.css('display', 'block');
        };
        var hide = function () {
          $element.css('display', 'none');
        };
        $scope.$on('loadingStatusActive', show);
        $scope.$on('loadingStatusInactive', hide);
        hide();
      }
    };
  });
