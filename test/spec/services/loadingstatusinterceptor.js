'use strict';

describe('Service: loadingStatusInterceptor', function () {

  // load the service's module
  beforeEach(module('festivalsWebApp'));

  // instantiate service
  var loadingStatusInterceptor;
  beforeEach(inject(function (_loadingStatusInterceptor_) {
    loadingStatusInterceptor = _loadingStatusInterceptor_;
  }));

  it('should do something', function () {
    expect(!!loadingStatusInterceptor).toBe(true);
  });

});
