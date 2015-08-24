'use strict';

describe('Filter: newsFilter', function () {

  // load the filter's module
  beforeEach(module('festivalsWebApp'));

  // initialize a new instance of the filter before each test
  var newsFilter;
  beforeEach(inject(function ($filter) {
    newsFilter = $filter('newsFilter');
  }));

  it('should return the input prefixed with "newsFilter filter:"', function () {
    var text = 'angularjs';
    expect(newsFilter(text)).toBe('newsFilter filter: ' + text);
  });

});
