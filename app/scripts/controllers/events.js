'use strict';

/**
 * @ngdoc function
 * @name festivalsWebApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the festivalsWebApp
 */
angular.module('festivalsWebApp')
  .controller('EventsCtrl', function ($scope, $timeout, $routeParams, collection, api) {

    var self = this;
    this.festivalId = $routeParams.festivalId;

    $scope.picker = {opened: false, format: 'dd-MM-yyyy'};
    $scope.enabledHours = true;

    $scope.openPicker = function () {
      $timeout(function () {
        $scope.picker.opened = true;
      });
    };

    $scope.closePicker = function () {
      $scope.picker.opened = false;
    };

    this.collection = collection;
    api.getFestivalPlaces(this.festivalId)
      .then(function (placesData) {
        $scope.places = placesData.places.map(function (place) {
          return {
            name: place.name,
            id: place.id
          };
        });
      });

    api.getFestivalCategories(this.festivalId)
      .then(function (placesData) {
        $scope.categories = placesData.categories.map(function (category) {
          return {
            name: category.name,
            id: category.id
          };
        });
      });

    this.statuses = ['', 'CREATED', 'PUBLISHED', 'CANCELED', 'MOVED'];

    function setProp(path, newValue) {
      var holder = {};
      switch (path) {
        case 'name':
          holder.name = newValue;
          return holder;
        case 'description':
          holder.description = newValue;
          return holder;
        case 'place':
          holder.place = newValue.id;
          return holder;
        case 'category':
          holder.category = newValue.id;
          return holder;
        case 'status':
          holder.status = newValue;
          return holder;
        case 'duration.startAt':
          holder.duration = {startAt: newValue};
          return holder;
        case 'duration.finishAt':
          holder.duration = {finishAt: newValue};
          return holder;
        case 'authors[0].name':
          holder.authors = [{name: newValue}];
          return holder;
        case 'authors[0].organization':
          holder.authors = [{organization: newValue}];
          return holder;
        case 'mainImage.large':
          holder.images = [{url: newValue}];
          return holder;
      }
    }

    this.updateTag = function updateTag(id, tag) {
      console.log('updateTag', id, tag);

      if (!tag || !tag.hasOwnProperty('text')) {
        console.log('invalid tag');
        return;
      }

      var el = collection.events.filter(function (el) {
        return el.id === id;
      });

      if (el) {
        var event = el[0];
        console.log('update tag for ' + event);

        var tags = event.tags.map(function (tag) {
          return tag.text;
        });

        var data = {
          tags: tags
        };

        //console.log('el', el);
        return api.updateFestivalsEvent(this.festivalId, id, data);
      }
    };

    this.update = function (id, param, value) {
      console.log('update', id, param, value);
      var data = setProp(param, value);

      console.log('data', data);

      return api.updateFestivalsEvent(this.festivalId, id, data);
    };

    this.remove = function (id) {
      console.log('remove', id);

      //remove real elem
      if (id) {
        collection.events = collection.events.filter(function (elem) {
          return elem.id !== id;
        });

        return api.deleteFestivalEvent(this.festivalId, id);
        //return; //TODO
      }
    };

    $scope.emptyEvent = {
      name: '',
      description: '',
      status: '',
      tags: '',
      duration: {
        startAt: '',
        finishAt: ''
      },
      mainImage: {
        large: ''
      },
      authors: [
        {
          name: '',
          organization: ''
        }
      ]
    };

    $scope.event = $scope.event || $scope.emptyEvent;

    this.save = function () {
      console.log('save', $scope.event);

      var data = angular.copy($scope.event);
      data.images = [];

      if (data.hasOwnProperty('tags') && data.tags) {
        console.log('tag for ' + data);

        var tags = data.tags.map(function (tag) {
          return tag.text;
        });

        data.tags = tags;
      }

      if (data.hasOwnProperty('mainImage') && data.mainImage && data.mainImage.large) {
        var image = {
          url: data.mainImage.large
        };

        data.images = [
          image
        ];
      }

      delete data.mainImage;

      if (data.hasOwnProperty('category')) {
        data.category = data.category.id;
      }

      if (data.hasOwnProperty('place')) {
        data.place = data.place.id;
      }

      var deferred = api.createFestivalsEvent(this.festivalId, data);

      deferred.then(function (value) {
        console.log('on save', value);
        self.reset();
        collection.events.push(value);
      });

      return deferred;
    };

    this.duplicate = function (id) {
      console.log('duplicate', id);

      var el = collection.events.filter(function (el) {
        return el.id === id;
      });

      if (el) {
        var event = el[0];
        console.log('duplicate event');
        console.log(event);
      }

      delete event.id;
      delete event['$$hashKey'];
      $scope.event = angular.copy(event);
    };

    this.reset = function () {
      console.log('reset');
      $scope.event = angular.copy($scope.emptyEvent);
    };


    //sorting
    $scope.sortType = 'duration.startAt';
    $scope.sortReverse = false;

    this.toggleSort = function toggleSort(type) {
      $scope.sortType = type;
      $scope.sortReverse = !$scope.sortReverse;
    };

    this.isSortAsc = function isSortAsc(type) {
      if (type === $scope.sortType) {
        return $scope.sortReverse;
      }
      return false;
    };

    this.isSortDesc = function isSortDesc(type) {
      if (type === $scope.sortType) {
        return !$scope.sortReverse;
      }
      return false;
    };

    //pagination
    $scope.currentPage = 0;
    $scope.search = {
      duration_startAtFrom: '',
      duration_startAtTo: ''
    };
    $scope.search.offset = 0;
    $scope.search.limit = 10;

    this.prevPage = function () {
      if ($scope.currentPage > 0) {
        $scope.currentPage--;
        this.setPage($scope.currentPage);
      }
    };

    this.setPage = function (page) {
      $scope.currentPage = page;
      $scope.search.offset = $scope.currentPage * $scope.search.limit;
    };

    this.prevPageDisabled = function () {
      return $scope.currentPage === 0 ? "disabled" : "";
    };

    this.pageCount = function () {
      if (!$scope.search.limit) {
        return 0;
      }

      return Math.ceil(collection.events.length / $scope.search.limit) - 1;
    };

    this.range = function () {
      var total = this.pageCount() + 1;

      var input = [];
      for (var i = 0; i < total; i++) {
        input.push(i);
      }
      return input;
    };

    this.nextPage = function () {
      if ($scope.currentPage < this.pageCount()) {
        $scope.currentPage++;
        this.setPage($scope.currentPage);
      }
    };

    this.nextPageDisabled = function () {
      return $scope.currentPage === this.pageCount() ? "disabled" : "";
    };

  });
