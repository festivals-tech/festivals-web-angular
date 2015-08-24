'use strict';

describe('Service: FestivalsApi', function () {

  // load the service's module
  beforeEach(module('festivalsWebApp'));

  // instantiate service
  var FestivalsApi;
  beforeEach(inject(function (_FestivalsApi_) {
    FestivalsApi = _FestivalsApi_;
  }));

  it('should do something', function () {
    expect(!!FestivalsApi).toBe(true);
  });

});
