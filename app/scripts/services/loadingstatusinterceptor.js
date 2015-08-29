'use strict';

/**
 * @ngdoc service
 * @name festivalsWebApp.loadingStatusInterceptor
 * @description
 * # loadingStatusInterceptor
 * Factory in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .factory('loadingStatusInterceptor', function ($q, $rootScope) {
    var activeRequests = 0;
    var started = function () {
      if (activeRequests == 0) {
        $rootScope.$broadcast('loadingStatusActive');
      }
      activeRequests++;
    };
    var ended = function () {
      activeRequests--;
      if (activeRequests == 0) {
        $rootScope.$broadcast('loadingStatusInactive');
      }
    };
    return {
      request: function (config) {
        started();
        return config || $q.when(config);
      },
      response: function (response) {
        ended();
        return response || $q.when(response);
      },
      responseError: function (rejection) {
        ended();
        return $q.reject(rejection);
      }
    };
  });
