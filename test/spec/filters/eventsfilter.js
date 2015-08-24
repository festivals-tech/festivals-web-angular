'use strict';

describe('Filter: eventsFilter', function () {

  // load the filter's module
  beforeEach(module('festivalsWebApp'));

  // initialize a new instance of the filter before each test
  var eventsFilter;
  beforeEach(inject(function ($filter) {
    eventsFilter = $filter('eventsFilter');
  }));

  it('should return the input prefixed with "eventsFilter filter:"', function () {
    var text = 'angularjs';
    expect(eventsFilter(text)).toBe('eventsFilter filter: ' + text);
  });

});
