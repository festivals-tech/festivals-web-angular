'use strict';

/**
 * @ngdoc function
 * @name festivalsWebApp.controller:FestivalsCtrl
 * @description
 * # FestivalsCtrl
 * Controller of the festivalsWebApp
 */
angular.module('festivalsWebApp')
  .controller('FestivalsCtrl', function ($scope, $timeout, collection, api) {
    var self = this;
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

    this.statuses = ['', 'CREATED', 'PUBLISHED', 'CANCELED'];
    this.types = ['', 'FANTASY', 'MUSIC', 'WOODSTOCK'];
    this.countries = ['PL'];

    function setProp(path, newValue) {
      var holder = {};
      switch (path) {
        case 'name':
          holder.name = newValue;
          return holder;
        case 'description':
          holder.description = newValue;
          return holder;
        case 'type':
          holder.type = newValue;
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
        case 'locations[0].name':
          holder.locations = [{name: newValue}];
          return holder;
        case 'locations[0].country':
          holder.locations = [{country: newValue}];
          return holder;
        case 'locations[0].city':
          holder.locations = [{city: newValue}];
          return holder;
        case 'locations[0].street':
          holder.locations = [{street: newValue}];
          return holder;
        case 'locations[0].state':
          holder.locations = [{state: newValue}];
          return holder;
        case 'locations[0].zip':
          holder.locations = [{zip: newValue}];
          return holder;
        case 'locations[0].openingTimes[0].startAt':
          holder.locations = [
            {
              openingTimes: [{startAt: newValue}]
            }
          ];
          return holder;
        case 'locations[0].openingTimes[0].finishAt':
          holder.locations = [
            {
              openingTimes: [{finishAt: newValue}]
            }
          ];
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

      var el = self.collection.festivals.filter(function (el) {
        return el.id === id;
      });

      if (el) {
        var festival = el[0];
        console.log('update tag for ' + festival);

        var tags = festival.tags.map(function (tag) {
          return tag.text;
        });

        var data = {
          tags: tags
        };

        //console.log('el', el);
        return api.updateFestival(id, data);
      }
    };

    this.update = function (id, param, value) {
      console.log('update', id, param, value);
      var data = setProp(param, value);

      console.log('data', data);

      return api.updateFestival(id, data);
    };

    this.remove = function (id, index) {
      console.log('remove', id, index);

      //remove real elem
      if (id) {
        self.collection.festivals = self.collection.festivals.filter(function (elem) {
          return elem.id !== id;
        });

        return api.deleteFestival(id);
      }
    };

    $scope.emptyFestival = {
      name: '',
      description: '',
      type: '',
      tags: '',
      duration: {
        startAt: '',
        finishAt: ''
      },
      locations: [
        {
          name: '',
          country: '',
          city: '',
          street: '',
          state: '',
          openingTimes: [
            {
              startAt: '',
              finishAt: ''
            }
          ]
        }
      ],
      mainImage: {
        large: ''
      }
    };

    $scope.festival = $scope.festival || $scope.emptyFestival;

    this.save = function () {
      console.log('save', $scope.festival);

      var data = angular.copy($scope.festival);

      if (data.hasOwnProperty('tags')) {
        console.log('tag for ' + data);

        var tags = data.tags.map(function (tag) {
          return tag.text;
        });

        data.tags = tags;
      }

      if (data.hasOwnProperty('mainImage')) {
        var image = {
          url: data.mainImage.large
        };

        data.images = [
          image
        ];

        delete data.mainImage;
      }

      var deferred = api.createFestival(data);

      deferred.then(function (value) {
        console.log('on save', value);
        self.reset();
        self.collection.festivals.push(value);
      });

      return deferred;
    };

    this.duplicate = function (id) {
      console.log('duplicate', id);

      var el = self.collection.festivals.filter(function (el) {
        return el.id === id;
      });

      if (el) {
        var festival = el[0];
        console.log('duplicate festival');
        console.log(festival);
      }

      delete festival.id;
      delete festival['$$hashKey'];
      $scope.festival = angular.copy(festival);
    };

    this.reset = function () {
      console.log('reset');
      $scope.festival = $scope.emptyFestival;
    };

    //sorting
    $scope.sortType = 'duration.startAt';
    $scope.sortReverse = true;

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

      return Math.ceil(self.collection.festivals.length / $scope.search.limit) - 1;
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
