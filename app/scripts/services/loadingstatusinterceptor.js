'use strict';

/**
 * @ngdoc service
 * @name festivalsWebApp.loadingStatusInterceptor
 * @description
 * # loadingStatusInterceptor
 * Factory in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .factory('loadingStatusInterceptor', function ($q, $rootScope, $loading) {
    var activeRequests = 0;
    var started = function () {
      if (activeRequests == 0) {
        $loading.start('data');
      }
      activeRequests++;
    };
    var ended = function () {
      activeRequests--;
      if (activeRequests == 0) {
        $loading.finish('data');
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
