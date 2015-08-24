'use strict';

describe('Directive: editableTextRow', function () {

  // load the directive's module
  beforeEach(module('festivalsWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<editable-text-row></editable-text-row>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the editableText directive');
  }));
});
