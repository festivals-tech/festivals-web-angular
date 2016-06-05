/*jshint -W069 */
/*jshint unused:false*/

/**
 * @ngdoc service
 * @name festivalsWebApp.FestivalsApi
 * @description
 * # FestivalsApi
 * Factory in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .factory('FestivalsApi', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
    'use strict';

    /**
     *
     * @class FestivalsApi
     * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
     * @param {string} [domainOrOptions.domain] - The project domain
     * @param {string} [domainOrOptions.cache] - An angularjs cache implementation
     * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
     * @param {string} [cache] - An angularjs cache implementation
     */
    var FestivalsApi = (function () {
      function FestivalsApi(options, cache) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = typeof(domain) === 'string' ? domain : 'https://festivals-app.herokuapp.com/api';
        if (this.domain.length === 0) {
          throw new Error('Domain parameter must be specified as a string.');
        }
        cache = cache || ((typeof options === 'object') ? options.cache : cache);
        this.cache = cache;
        this.token = (typeof options === 'object') ? (options.token ? options.token : {}) : {};
      }

      FestivalsApi.prototype.$on = function ($scope, path, handler) {
        var url = this.domain + path;
        $scope.$on(url, function () {
          handler();
        });
        return this;
      };

      FestivalsApi.prototype.$broadcast = function (path) {
        var url = this.domain + path;
        //cache.remove(url);
        $rootScope.$broadcast(url);
        return this;
      };

      FestivalsApi.transformRequest = function (obj) {
        var str = [];
        for (var p in obj) {
          var val = obj[p];
          if (angular.isArray(val)) {
            /*jshint -W083 */
            val.forEach(function (val) {
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
            });
            /*jshint +W083 */
          } else {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
          }
        }
        return str.join("&");
      };

      /**
       * Set Token
       * @method
       * @name FestivalsApi#setToken
       * @param {string} value - token's value
       *
       */
      FestivalsApi.prototype.setToken = function (value) {
        this.token.value = value;
      };

      /**
       * Get news collection
       * @method
       * @name FestivalsApi#getNewsCollection
       * @param {string} updatedAt - updatedAt
       * @param {integer} limit - limit
       * @param {integer} offset - offset
       * @param {string} country - country
       *
       */
      FestivalsApi.prototype.getNewsCollection = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/news';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['updatedAt'] !== undefined) {
          queryParameters['updatedAt'] = parameters['updatedAt'];
        }

        if (parameters['limit'] !== undefined) {
          queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
          queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['country'] !== undefined) {
          queryParameters['country'] = parameters['country'];
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Create news
       * @method
       * @name FestivalsApi#createNews
       * @param {} newsRequest - News object
       *
       */
      FestivalsApi.prototype.createNews = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/news';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['newsRequest'] !== undefined) {
          body = parameters['newsRequest'];
        }

        if (parameters['newsRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: newsRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'POST',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get news
       * @method
       * @name FestivalsApi#getNews
       * @param {string} id - News id
       *
       */
      FestivalsApi.prototype.getNews = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/news/{news.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Delete news
       * @method
       * @name FestivalsApi#deleteNews
       * @param {string} id - News id
       *
       */
      FestivalsApi.prototype.deleteNews = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/news/{news.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'DELETE',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Update news
       * @method
       * @name FestivalsApi#updateNews
       * @param {string} id - News id
       * @param {} newsRequest - News object
       *
       */
      FestivalsApi.prototype.updateNews = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/news/{news.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{news.id}', parameters['news.id']);

        if (parameters['news.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: news.id'));
          return deferred.promise;
        }

        if (parameters['newsRequest'] !== undefined) {
          body = parameters['newsRequest'];
        }

        if (parameters['newsRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: newsRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'PUT',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get festivals collection
       * @method
       * @name FestivalsApi#getFestivals
       * @param {string} name - name
       * @param {string} description - description

       * @param {string} tag - tag
       * @param {string} dateFrom - dateFrom
       * @param {string} dateTo - dateTo
       * @param {string} location.country - location country
       * @param {string} location.name - location name
       * @param {string} location.city - location city
       * @param {string} location.state - location state
       * @param {string} updatedAt - updatedAt
       * @param {integer} limit - limit
       * @param {integer} offset - offset
       *
       */
      FestivalsApi.prototype.getFestivals = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['name'] !== undefined) {
          queryParameters['name'] = parameters['name'];
        }

        if (parameters['description'] !== undefined) {
          queryParameters['description'] = parameters['description'];
        }

        if (parameters['type'] !== undefined) {
          queryParameters['type'] = parameters['type'];
        }

        if (parameters['tag'] !== undefined) {
          queryParameters['tag'] = parameters['tag'];
        }

        if (parameters['dateFrom'] !== undefined) {
          queryParameters['dateFrom'] = parameters['dateFrom'];
        }

        if (parameters['dateTo'] !== undefined) {
          queryParameters['dateTo'] = parameters['dateTo'];
        }

        if (parameters['location.country'] !== undefined) {
          queryParameters['location.country'] = parameters['location.country'];
        }

        if (parameters['location.name'] !== undefined) {
          queryParameters['location.name'] = parameters['location.name'];
        }

        if (parameters['location.city'] !== undefined) {
          queryParameters['location.city'] = parameters['location.city'];
        }

        if (parameters['location.state'] !== undefined) {
          queryParameters['location.state'] = parameters['location.state'];
        }

        if (parameters['updatedAt'] !== undefined) {
          queryParameters['updatedAt'] = parameters['updatedAt'];
        }

        if (parameters['limit'] !== undefined) {
          queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
          queryParameters['offset'] = parameters['offset'];
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Create festival
       * @method
       * @name FestivalsApi#createFestival
       * @param {} festivalRequest - Festival object
       *
       */
      FestivalsApi.prototype.createFestival = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['festivalRequest'] !== undefined) {
          body = parameters['festivalRequest'];
        }

        if (parameters['festivalRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: festivalRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'POST',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get festival
       * @method
       * @name FestivalsApi#getFestival
       * @param {string} id - Festival id
       *
       */
      FestivalsApi.prototype.getFestival = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Delete festival
       * @method
       * @name FestivalsApi#deleteFestival
       * @param {string} id - Festival id
       *
       */
      FestivalsApi.prototype.deleteFestival = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'DELETE',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Update festival
       * @method
       * @name FestivalsApi#updateFestival
       * @param {string} id - Festival id
       * @param {} festivalRequest - Festival object
       *
       */
      FestivalsApi.prototype.updateFestival = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters['festivalRequest'] !== undefined) {
          body = parameters['festivalRequest'];
        }

        if (parameters['festivalRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: festivalRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'PUT',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get festival events collection
       * @method
       * @name FestivalsApi#getFestivalEvents
       * @param {string} id - Festival id
       * @param {string} name - name
       * @param {string} description - description
       * @param {string} place.name - place name
       * @param {string} category.name - category name
       * @param {string} dateFrom - dateFrom
       * @param {string} dateTo - dateTo
       * @param {string} author.name - author name
       * @param {string} author.organization - author organization
       * @param {string} updatedAt - updatedAt
       * @param {integer} limit - limit
       * @param {integer} offset - offset
       *
       */
      FestivalsApi.prototype.getFestivalEvents = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/events';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters['name'] !== undefined) {
          queryParameters['name'] = parameters['name'];
        }

        if (parameters['description'] !== undefined) {
          queryParameters['description'] = parameters['description'];
        }

        if (parameters['place.name'] !== undefined) {
          queryParameters['place.name'] = parameters['place.name'];
        }

        if (parameters['category.name'] !== undefined) {
          queryParameters['category.name'] = parameters['category.name'];
        }

        if (parameters['dateFrom'] !== undefined) {
          queryParameters['dateFrom'] = parameters['dateFrom'];
        }

        if (parameters['dateTo'] !== undefined) {
          queryParameters['dateTo'] = parameters['dateTo'];
        }

        if (parameters['author.name'] !== undefined) {
          queryParameters['author.name'] = parameters['author.name'];
        }

        if (parameters['author.organization'] !== undefined) {
          queryParameters['author.organization'] = parameters['author.organization'];
        }

        if (parameters['updatedAt'] !== undefined) {
          queryParameters['updatedAt'] = parameters['updatedAt'];
        }

        if (parameters['limit'] !== undefined) {
          queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
          queryParameters['offset'] = parameters['offset'];
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Create festival events
       * @method
       * @name FestivalsApi#createFestivalEvent
       * @param {string} id - Festival id
       * @param {} festivalEventRequest - Festival event object
       *
       */
      FestivalsApi.prototype.createFestivalEvent = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/events';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters['festivalEventRequest'] !== undefined) {
          body = parameters['festivalEventRequest'];
        }

        if (parameters['festivalEventRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: festivalEventRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'POST',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get festival event collection
       * @method
       * @name FestivalsApi#getFestivalEvent
       * @param {string} id - Festival id
       * @param {string} event.id - Event id
       *
       */
      FestivalsApi.prototype.getFestivalEvent = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/events/{event.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{event.id}', parameters['event.id']);

        if (parameters['event.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: event.id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Delete festival events
       * @method
       * @name FestivalsApi#deleteFestivalEvent
       * @param {string} id - Festival id
       * @param {string} event.id - Event id
       *
       */
      FestivalsApi.prototype.deleteFestivalEvent = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/events/{event.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{event.id}', parameters['event.id']);

        if (parameters['event.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: event.id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'DELETE',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Update festival events
       * @method
       * @name FestivalsApi#updateFestivalEvent
       * @param {string} id - Festival id
       * @param {string} event.id - Event id
       * @param {} festivalEventRequest - Festival event object
       *
       */
      FestivalsApi.prototype.updateFestivalEvent = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/events/{event.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{event.id}', parameters['event.id']);

        if (parameters['event.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: event.id'));
          return deferred.promise;
        }

        if (parameters['festivalEventRequest'] !== undefined) {
          body = parameters['festivalEventRequest'];
        }

        if (parameters['festivalEventRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: festivalEventRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'PUT',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get festival categories collection
       * @method
       * @name FestivalsApi#getFestivalCategories
       * @param {string} id - Festival id
       * @param {string} updatedAt - updatedAt
       * @param {string} parent.id - category parent id
       * @param {string} name - name
       * @param {integer} limit - limit
       * @param {integer} offset - offset
       *
       */
      FestivalsApi.prototype.getFestivalCategories = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/categories';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters['updatedAt'] !== undefined) {
          queryParameters['updatedAt'] = parameters['updatedAt'];
        }

        if (parameters['parent.id'] !== undefined) {
          queryParameters['parent.id'] = parameters['parent.id'];
        }

        if (parameters['name'] !== undefined) {
          queryParameters['name'] = parameters['name'];
        }

        if (parameters['limit'] !== undefined) {
          queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
          queryParameters['offset'] = parameters['offset'];
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Create festival category
       * @method
       * @name FestivalsApi#createFestivalCategory
       * @param {string} id - Festival id
       * @param {} festivalCategoryRequest - Festival category object
       *
       */
      FestivalsApi.prototype.createFestivalCategory = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/categories';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters['festivalCategoryRequest'] !== undefined) {
          body = parameters['festivalCategoryRequest'];
        }

        if (parameters['festivalCategoryRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: festivalCategoryRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'POST',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get festival category
       * @method
       * @name FestivalsApi#getFestivalCategory
       * @param {string} id - Festival id
       * @param {string} category.id - Category id
       *
       */
      FestivalsApi.prototype.getFestivalCategory = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/categories/{category.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{category.id}', parameters['category.id']);

        if (parameters['category.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: category.id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Delete festival category
       * @method
       * @name FestivalsApi#deleteFestivalCategory
       * @param {string} id - Festival id
       * @param {string} category.id - Category id
       *
       */
      FestivalsApi.prototype.deleteFestivalCategory = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/categories/{category.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{category.id}', parameters['category.id']);

        if (parameters['category.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: category.id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'DELETE',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Update festival category
       * @method
       * @name FestivalsApi#updateFestivalCategory
       * @param {string} id - Festival id
       * @param {string} category.id - Category id
       * @param {} festivalCategoryRequest - Festival category object
       *
       */
      FestivalsApi.prototype.updateFestivalCategory = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/categories/{category.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{category.id}', parameters['category.id']);

        if (parameters['category.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: category.id'));
          return deferred.promise;
        }

        if (parameters['festivalCategoryRequest'] !== undefined) {
          body = parameters['festivalCategoryRequest'];
        }

        if (parameters['festivalCategoryRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: festivalCategoryRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'PUT',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get festival places collection
       * @method
       * @name FestivalsApi#getFestivalPlaces
       * @param {string} id - Festival id
       * @param {string} updatedAt - updatedAt
       * @param {string} parent.id - place parent id
       * @param {string} name - name
       * @param {integer} limit - limit
       * @param {integer} offset - offset
       *
       */
      FestivalsApi.prototype.getFestivalPlaces = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/places';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters['updatedAt'] !== undefined) {
          queryParameters['updatedAt'] = parameters['updatedAt'];
        }

        if (parameters['parent.id'] !== undefined) {
          queryParameters['parent.id'] = parameters['parent.id'];
        }

        if (parameters['name'] !== undefined) {
          queryParameters['name'] = parameters['name'];
        }

        if (parameters['limit'] !== undefined) {
          queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
          queryParameters['offset'] = parameters['offset'];
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Create festival place
       * @method
       * @name FestivalsApi#createFestivalPlace
       * @param {string} id - Festival id
       * @param {} festivalPlaceRequest - Festival place object
       *
       */
      FestivalsApi.prototype.createFestivalPlace = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/places';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters['festivalPlaceRequest'] !== undefined) {
          body = parameters['festivalPlaceRequest'];
        }

        if (parameters['festivalPlaceRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: festivalPlaceRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'POST',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get festival place
       * @method
       * @name FestivalsApi#getFestivalPlace
       * @param {string} id - Festival id
       * @param {string} place.id - Place id
       *
       */
      FestivalsApi.prototype.getFestivalPlace = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/places/{place.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{place.id}', parameters['place.id']);

        if (parameters['place.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: place.id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Delete festival place
       * @method
       * @name FestivalsApi#deleteFestivalPlace
       * @param {string} id - Festival id
       * @param {string} place.id - Place id
       *
       */
      FestivalsApi.prototype.deleteFestivalPlace = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/places/{place.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{place.id}', parameters['place.id']);

        if (parameters['place.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: place.id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'DELETE',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Update festival place
       * @method
       * @name FestivalsApi#updateFestivalPlace
       * @param {string} id - Festival id
       * @param {string} place.id - Place id
       * @param {} festivalPlaceRequest - Festival place object
       *
       */
      FestivalsApi.prototype.updateFestivalPlace = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/places/{place.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{place.id}', parameters['place.id']);

        if (parameters['place.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: place.id'));
          return deferred.promise;
        }

        if (parameters['festivalPlaceRequest'] !== undefined) {
          body = parameters['festivalPlaceRequest'];
        }

        if (parameters['festivalPlaceRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: festivalPlaceRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'PUT',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get festival news collection
       * @method
       * @name FestivalsApi#getFestivalNewsCollection
       * @param {string} id - Festival id
       * @param {string} updatedAt - updatedAt
       * @param {integer} limit - limit
       * @param {integer} offset - offset
       *
       */
      FestivalsApi.prototype.getFestivalNewsCollection = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/news';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters['updatedAt'] !== undefined) {
          queryParameters['updatedAt'] = parameters['updatedAt'];
        }

        if (parameters['limit'] !== undefined) {
          queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
          queryParameters['offset'] = parameters['offset'];
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Create news
       * @method
       * @name FestivalsApi#createNews
       * @param {string} id - Festival id
       * @param {} newsRequest - News object
       *
       */
      FestivalsApi.prototype.createFestivalNews = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/news';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        if (parameters['newsRequest'] !== undefined) {
          body = parameters['newsRequest'];
        }

        if (parameters['newsRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: newsRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'POST',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Get news
       * @method
       * @name FestivalsApi#getNews
       * @param {string} id - Festival id
       * @param {string} news.id - News id
       *
       */
      FestivalsApi.prototype.getFestivalNews = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/news/{news.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{news.id}', parameters['news.id']);

        if (parameters['news.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: news.id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && parameters.$refresh !== true) {
          deferred.resolve(cached);
          return deferred.promise;
        }
        var options = {
          timeout: parameters.$timeout,
          method: 'GET',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Delete news
       * @method
       * @name FestivalsApi#deleteNews
       * @param {string} id - Festival id
       * @param {string} news.id - News id
       *
       */
      FestivalsApi.prototype.deleteNews = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/news/{news.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{news.id}', parameters['news.id']);

        if (parameters['news.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: news.id'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'DELETE',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };
      /**
       * Update news
       * @method
       * @name FestivalsApi#updateFestivalNews
       * @param {string} id - Festival id
       * @param {string} news.id - News id
       * @param {} newsRequest - News object
       *
       */
      FestivalsApi.prototype.updateFestivalNews = function (parameters) {
        if (parameters === undefined) {
          parameters = {};
        }
        var deferred = $q.defer();

        var domain = this.domain;
        var path = '/festivals/{id}/news/{news.id}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.value) {
          headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: id'));
          return deferred.promise;
        }

        path = path.replace('{news.id}', parameters['news.id']);

        if (parameters['news.id'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: news.id'));
          return deferred.promise;
        }

        if (parameters['newsRequest'] !== undefined) {
          body = parameters['newsRequest'];
        }

        if (parameters['newsRequest'] === undefined) {
          deferred.reject(new Error('Missing required  parameter: newsRequest'));
          return deferred.promise;
        }

        if (parameters.$queryParameters) {
          Object.keys(parameters.$queryParameters)
            .forEach(function (parameterName) {
              var parameter = parameters.$queryParameters[parameterName];
              queryParameters[parameterName] = parameter;
            });
        }

        /**
         * headers['Content-Type'] = '';
         * headers['Accept'] = '';
         */

        headers['Accept'] = 'application/vnd.festivals.v1+json';
        headers['User-Agent'] = 'festivals-client';

        var url = domain + path;
        var options = {
          timeout: parameters.$timeout,
          method: 'PUT',
          url: url,
          params: queryParameters,
          data: body,
          headers: headers
        };
        if (Object.keys(form).length > 0) {
          options.data = form;
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          options.transformRequest = FestivalsApi.transformRequest;
        }
        $http(options)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
            if (parameters.$cache !== undefined) {
              parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
            }
          })
          .error(function (data, status, headers, config) {
            deferred.reject({
              status: status,
              headers: headers,
              config: config,
              body: data
            });
          });

        return deferred.promise;
      };

      return FestivalsApi;
    })();

    return FestivalsApi;
  }]);

/*jshint +W069 */
/*jshint unused:true*/
