'use strict';

describe('Filter: placeFilter', function () {

  // load the filter's module
  beforeEach(module('festivalsWebApp'));

  // initialize a new instance of the filter before each test
  var placeFilter;
  beforeEach(inject(function ($filter) {
    placeFilter = $filter('placesFilter');
  }));

  it('should return the input prefixed with "placeFilter filter:"', function () {
    var text = 'angularjs';
    expect(placeFilter(text)).toBe('placeFilter filter: ' + text);
  });

});
