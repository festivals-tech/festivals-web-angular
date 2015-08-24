'use strict';

describe('Filter: LocationFilter', function () {

  // load the filter's module
  beforeEach(module('festivalsWebApp'));

  // initialize a new instance of the filter before each test
  var LocationFilter;
  beforeEach(inject(function ($filter) {
    LocationFilter = $filter('LocationFilter');
  }));

  it('should return the input prefixed with "LocationFilter filter:"', function () {
    var text = 'angularjs';
    expect(LocationFilter(text)).toBe('LocationFilter filter: ' + text);
  });

});
