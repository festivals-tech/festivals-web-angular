'use strict';

/**
 * @ngdoc overview
 * @name festivalsWebApp
 * @description
 * # festivalsWebApp
 *
 * Main module of the application.
 */
angular
  .module('festivalsWebApp', [
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngTouch',
    'ngSanitize',
    'xeditable',
    'ui.bootstrap',
    'ngTagsInput',
    'pascalprecht.translate',
    'oauth'
  ])
  .run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    //editableOptions.theme = 'default'; // bootstrap3 theme. Can be also 'bs2', 'default'
  })
  .config(['$translateProvider', function ($translateProvider) {
    $translateProvider
      .registerAvailableLanguageKeys(['en', 'pl'], {
        'en_US': 'en',
        'en_UK': 'en',
        'pl_PL': 'pl'
      })
      .determinePreferredLanguage()
      .useStaticFilesLoader({
        prefix: 'data/locale-',
        suffix: '.json'
      })
      .useLoaderCache(true)
      .useSanitizeValueStrategy('escape')
      .useMissingTranslationHandlerLog();
  }])
  .constant('oauthConstant', {
      url: 'https://desolate-temple-8751.herokuapp.com',
      clientName: 'festivals-web-client',
      redirectUri: 'http://localhost:9000',
      //redirectUri: 'https://festivals-tech-web.herokuapp.com',
      profileUrl: 'https://desolate-temple-8751.herokuapp.com/userinfo'
  })
  .value('apiUrl', 'https://festivals.tech/api')
  //.value('apiUrl', 'http://localhost:3000/api')
  .config(['$httpProvider', function ($httpProvider) {

    //$http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w'

    //$httpProvider.defaults.headers.post =
    $httpProvider.defaults.headers.common = {
      Accept: 'application/vnd.festivals.v1+json'
    };

    // intercept for oauth tokens
    $httpProvider.interceptors.push('oauthInterceptor', 'loadingStatusInterceptor');
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/festivals', {
        templateUrl: 'views/festivals.html',
        controller: 'FestivalsCtrl',
        controllerAs: 'ctrl',
        resolve: {
          collection: function (api) {
            return api.getFestivals();
          }
        }
      })
      .when('/festivals/:festivalId/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl',
        controllerAs: 'ctrl',
        resolve: {
          collection: function ($route, api) {
            return api.getFestivalEvents($route.current.params.festivalId);
          }
        }
      })
      .when('/festivals/:festivalId/places', {
        templateUrl: 'views/places.html',
        controller: 'PlacesCtrl',
        controllerAs: 'ctrl',
        resolve: {
          collection: function ($route, api) {
            return api.getFestivalPlaces($route.current.params.festivalId);
          }
        }
      })
      .when('/festivals/:festivalId/categories', {
        templateUrl: 'views/categories.html',
        controller: 'CategoriesCtrl',
        controllerAs: 'ctrl',
        resolve: {
          collection: function ($route, api) {
            return api.getFestivalCategories($route.current.params.festivalId);
          }
        }
      })
      .when('/news', {
        templateUrl: 'views/news.html',
        controller: 'NewsCtrl',
        controllerAs: 'ctrl',
        resolve: {
          collection: function (api) {
            return api.getNewsCollection();
          }
        }
      })
      .when('/token_type=:type&access_token=:accessToken', {
        template: '',
        controller: function ($location, AccessToken) {

          console.log('$location', $location);

          var hash = $location.path().substr(1);
          AccessToken.setTokenFromString(hash);
          $location.path('/');
          $location.replace();
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
