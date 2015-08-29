'use strict';

/**
 * @ngdoc service
 * @name festivalsWebApp.oauthInterceptor
 * @description
 * # oauthInterceptor
 * Factory in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .factory('oauthInterceptor', ['$q', '$injector', '$location', '$rootScope', 'oauthConstant', 'AccessToken', 'Endpoint',
    function ($q, $injector, $location, $rootScope, oauthConstant, AccessToken, Endpoint) {
      var oauthInterceptor = {

        request: function (config) {
          var token = AccessToken.get();
          if (token) {
            config.headers.authorization = 'Bearer ' + token.access_token;
          }

          return config;
        },
        requestError: function (rejectReason) {
          console.log('rejectReason', rejectReason);
          return $q.reject(rejectReason);
        },
        response: function (response) {
          if ($location.url().indexOf('oauth=true') > -1) {
            var hash = $location.url().substr($location.url().indexOf('oauth=true&'));
            var path = $location.path().substr(1);

            AccessToken.setTokenFromString(hash);
            $location.url(path || '/');
            $location.replace();
            return $q.reject(response);
          }
          return response;
        },

        responseError: function (response) {

          if (response.status === 401 && response.data.code && response.data.code === 'UnauthorizedError') {
            //var redirectUri = oauthConstant.redirectUri + '/#' + $location.url();
            //var redirectUri = $location.absUrl();
            var redirectUri = $location.absUrl() + '?oauth=true';
            //var redirectUri = oauthConstant.redirectUri + '/#' + '?path=' + $location.path();
            console.log('need to login: ', redirectUri);
            Endpoint.redirect({redirectUri: redirectUri});
            return $q.reject(response);
          }

          if (response.status === 403 && response.data.code && response.data.code === 'ForbiddenError') {
            //console.log('forbidden');
            $rootScope.$broadcast('modal.api.error.show', response.data);
            return $q.reject(response);
          }

          return response;
        }
      };
      return oauthInterceptor;
    }]);
