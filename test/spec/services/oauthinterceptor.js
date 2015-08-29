'use strict';

describe('Service: oauthInterceptor', function () {

  // load the service's module
  beforeEach(module('festivalsWebApp'));

  // instantiate service
  var oauthInterceptor;
  beforeEach(inject(function (_oauthInterceptor_) {
    oauthInterceptor = _oauthInterceptor_;
  }));

  it('should do something', function () {
    expect(!!oauthInterceptor).toBe(true);
  });

});
