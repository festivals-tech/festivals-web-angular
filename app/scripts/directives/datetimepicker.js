'use strict';

/**
 * @ngdoc directive
 * @name festivalsWebApp.directive:dateTimePicker
 * @description
 * # dateTimePicker
 */
angular.module('festivalsWebApp')
  .directive('dateTimePicker', function ($timeout, $parse) {
    return {
      link: function ($scope, element, $attrs) {
        return $timeout(function () {
          var ngModelGetter = $parse($attrs.ngModel);

          return $(element).datetimepicker(
            {
              //minDate: moment().add(1, 'd').toDate(),
              format: $attrs.format || 'DD-MM-YYYY',
              sideBySide: $attrs['side-by-side'] || true,
              allowInputToggle: $attrs.allowInputToggle || true,
              //language: $attrs.language || undefined,
              useCurrent: $attrs['use-current'] || false,
              //defaultDate: moment().add(1, 'd').add(1, 'h'),
              icons: {
                time: 'icon-back-in-time',
                date: 'icon-calendar-outlilne',
                up: 'icon-up-open-big',
                down: 'icon-down-open-big',
                previous: 'icon-left-open-big',
                next: 'icon-right-open-big',
                today: 'icon-bullseye',
                clear: 'icon-cancel'
              }
            }
          ).on('dp.change', function (event) {
              $scope.$apply(function () {
                return ngModelGetter.assign($scope, event.target.value);
              });
            });
        });
      }
    };
  });