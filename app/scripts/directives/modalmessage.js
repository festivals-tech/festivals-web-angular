'use strict';

/**
 * @ngdoc directive
 * @name festivalsWebApp.directive:modalMessage
 * @description
 * # modalMessage
 */
angular.module('festivalsWebApp')
  .directive('modalMessage', function ($rootScope, dialogs) {
    return {
      link: function () {
        $rootScope.$on('modal.api.error.show', function (msg, data) {
          //console.info('modal.api.error.show', msg, data);
          dialogs.error('Komunikat od serwera', data.userMessage);
        });
      }
    };
  });
