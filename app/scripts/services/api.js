'use strict';

/**
 * @ngdoc service
 * @name festivalsWebApp.api
 * @description
 * # api
 * Service in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .service('api', function ($q, apiUrl, AccessToken, FestivalsApi) {

    console.log('init api');

    var options = {
      domain: apiUrl
    };

    var festivalsApiDeferred = new FestivalsApi(options);

    var setUpToken = function setUpToken(AccessToken) {

      AccessToken.set();

      if (AccessToken.get()) {
        festivalsApiDeferred.setToken(AccessToken.get().access_token);
      }

    };

    this.getFestivals = function getFestivals() {
      console.log('getFestivals');

      setUpToken(AccessToken);

      var query = {
        //name: 'festival-name'
      };

      return festivalsApiDeferred.getFestivals(query);
    };

    this.deleteFestival = function deleteFestival(id) {
      console.log('deleteFestival', id);

      setUpToken(AccessToken);

      var query = {
        id: id
      };

      return festivalsApiDeferred.deleteFestival(query);
    };

    this.updateFestival = function updateFestival(id, data) {
      console.log('updateFestival', id, data);

      setUpToken(AccessToken);

      var params = {
        id: id,
        festivalRequest: data
      };

      return festivalsApiDeferred.updateFestival(params);
    };

    this.createFestival = function createFestival(data) {
      console.log('createFestival', data);

      setUpToken(AccessToken);

      var params = {
        festivalRequest: data
      };

      return festivalsApiDeferred.createFestival(params);
    };

    this.getNewsCollection = function getNewsCollection() {
      console.log('getNewsCollection');

      setUpToken(AccessToken);

      var query = {
        //name: 'name'
      };

      return festivalsApiDeferred.getNewsCollection(query);
    };

    this.updateNews = function updateNews(id, data) {
      console.log('updateNews', id, data);

      setUpToken(AccessToken);

      var params = {
        'news.id': id,
        newsRequest: data
      };

      return festivalsApiDeferred.updateNews(params);
    };

    this.createNews = function createNews(data) {
      console.log('createNews', data);

      setUpToken(AccessToken);

      var params = {
        newsRequest: data
      };

      return festivalsApiDeferred.createNews(params);
    };

    this.getFestivalEvents = function getFestivalEvents(id) {
      console.log('getFestivalEvents', id);

      setUpToken(AccessToken);

      var query = {
        id: id
      };

      return festivalsApiDeferred.getFestivalEvents(query);
    };

    this.deleteFestivalEvent = function deleteFestivalEvent(id, eventId) {
      console.log('deleteFestivalEvent', id, eventId);

      setUpToken(AccessToken);

      var query = {
        id: id,
        'event.id': eventId
      };

      return festivalsApiDeferred.deleteFestivalEvent(query);
    };

    this.updateFestivalsEvent = function updateFestivalsEvent(id, eventId, data) {
      console.log('updateFestivalsEvent', id, eventId, data);

      setUpToken(AccessToken);

      var params = {
        id: id,
        'event.id': eventId,
        festivalEventRequest: data
      };

      return festivalsApiDeferred.updateFestivalEvent(params);
    };

    this.createFestivalsEvent = function createFestivalsEvent(id, data) {
      console.log('createFestivalsEvent', id, data);

      setUpToken(AccessToken);

      var params = {
        id: id,
        festivalEventRequest: data
      };

      return festivalsApiDeferred.createFestivalEvent(params);
    };

    this.getFestivalPlaces = function getFestivalPlaces(id) {
      console.log('getFestivalPlaces', id);

      setUpToken(AccessToken);

      var query = {
        id: id
      };

      return festivalsApiDeferred.getFestivalPlaces(query);
    };

    this.deleteFestivalPlace = function deleteFestivalPlace(id, eventId) {
      console.log('deleteFestivalPlace', id, eventId);

      setUpToken(AccessToken);

      var query = {
        id: id,
        'place.id': eventId
      };

      return festivalsApiDeferred.deleteFestivalPlace(query);
    };

    this.updateFestivalPlace = function updateFestivalPlace(id, eventId, data) {
      console.log('updateFestivalPlace', id, eventId, data);

      setUpToken(AccessToken);

      var params = {
        id: id,
        'place.id': eventId,
        festivalPlaceRequest: data
      };

      return festivalsApiDeferred.updateFestivalPlace(params);
    };

    this.createFestivalPlace = function createFestivalPlace(id, data) {
      console.log('createFestivalPlace', id, data);

      setUpToken(AccessToken);

      var params = {
        id: id,
        festivalPlaceRequest: data
      };

      return festivalsApiDeferred.createFestivalPlace(params);
    };

    this.getFestivalCategories = function getFestivalCategories(id) {
      console.log('getFestivalCategories', id);

      setUpToken(AccessToken);

      var query = {
        id: id
      };

      return festivalsApiDeferred.getFestivalCategories(query);
    };

    this.deleteFestivalCategory = function deleteFestivalCategory(id, eventId) {
      console.log('deleteFestivalCategory', id, eventId);

      setUpToken(AccessToken);

      var query = {
        id: id,
        'category.id': eventId
      };

      return festivalsApiDeferred.deleteFestivalCategory(query);
    };

    this.updateFestivalCategory = function updateFestivalCategory(id, eventId, data) {
      console.log('updateFestivalCategory', id, eventId, data);

      setUpToken(AccessToken);

      var params = {
        id: id,
        'category.id': eventId,
        festivalCategoryRequest: data
      };

      return festivalsApiDeferred.updateFestivalCategory(params);
    };

    this.createFestivalCategory = function createFestivalCategory(id, data) {
      console.log('createFestivalCategory', id, data);
      setUpToken(AccessToken);

      var params = {
        id: id,
        festivalCategoryRequest: data
      };

      return festivalsApiDeferred.createFestivalCategory(params);
    };

  });