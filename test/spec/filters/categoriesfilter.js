'use strict';

describe('Filter: categoriesFilter', function () {

  // load the filter's module
  beforeEach(module('festivalsWebApp'));

  // initialize a new instance of the filter before each test
  var categoriesFilter;
  beforeEach(inject(function ($filter) {
    categoriesFilter = $filter('categoriesFilter');
  }));

  it('should return the input prefixed with "categoriesFilter filter:"', function () {
    var text = 'angularjs';
    expect(categoriesFilter(text)).toBe('categoriesFilter filter: ' + text);
  });

});
