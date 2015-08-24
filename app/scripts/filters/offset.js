'use strict';

/**
 * @ngdoc filter
 * @name festivalsWebApp.filter:offset
 * @function
 * @description
 * # offset
 * Filter in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .filter('offset', function () {
    return function (input, start) {
      start = parseInt(start, 10);
      return input.slice(start);
    };
  });

