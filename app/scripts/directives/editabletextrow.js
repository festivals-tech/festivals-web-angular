'use strict';

/**
 * @ngdoc directive
 * @name festivalsWebApp.directive:editableText
 * @description
 * # editableText
 */
angular.module('festivalsWebApp')
  .directive('editableTextRow', function () {
    return {
      scope: {},
      //controller: function ($scope) {
      //  console.log($scope);

        //var panes = $scope.panes = [];
        //
        //$scope.select = function (pane) {
        //  angular.forEach(panes, function (pane) {
        //    pane.selected = false;
        //  });
        //  pane.selected = true;
        //};
        //
        //this.addPane = function (pane) {
        //  if (panes.length === 0) {
        //    $scope.select(pane);
        //  }
        //  panes.push(pane);
        //};
      //},
      template: '<div class="row">' +
      '<label class="col-md-3">Name</label>' +
      '<div class="col-md-9">' +
      '<a href="#" editable-text="elem.name" e-required onbeforesave="ctrl.update(elem.id, \'name\', $data)">{{ elem.name || \'unknown\' }}' +
      '</a> ' +
      '</div> ' +
      '</div>',
      restrict: 'E'
      //scope: {
      //  title: '@'
      //}
      //link: function postLink(scope, element, attrs) {
      //  console.log(scope, element, attrs);
      //  element.text('this is the editableText directive');
      //}
    };
  });
