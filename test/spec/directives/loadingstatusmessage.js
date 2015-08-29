'use strict';

describe('Directive: loadingStatusMessage', function () {

  // load the directive's module
  beforeEach(module('festivalsWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<loading-status-message></loading-status-message>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the loadingStatusMessage directive');
  }));
});
