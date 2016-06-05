'use strict';

/**
 * @ngdoc function
 * @name festivalsWebApp.controller:PlacesCtrl
 * @description
 * # PlacesCtrl
 * Controller of the festivalsWebApp
 */
angular.module('festivalsWebApp')
  .controller('PlacesCtrl', function ($scope, $timeout, $routeParams, collection, api) {

    this.festivalId = $routeParams.festivalId;

    $scope.parents = collection.places.map(function (place) {
      return {
        name: place.name,
        id: place.id
      };
    });

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


    var getParent = function getParent(id, places) {
      return places
        .filter(function (category) {
          return category.id === id;
        })
        .map(function (category) {
          return {
            name: category.name,
            id: category.id
          };
        })[0];
    };

    this.collection = {
      total: 0,
      places: []
    };

    var self = this;
    this.collection.total = collection.total;
    this.collection.places = collection.places
      .map(function (category) {
        if (category.parent) {
          category.parent = getParent(category.parent, collection.places);
        }

        return category;
      });

    function setProp(path, newValue) {
      var holder = {};
      switch (path) {
        case 'name':
          holder.name = newValue;
          return holder;
        case 'parent':
          holder.parent = newValue.id;
          return holder;
        case 'coordinates.lat':
          holder.coordinates = {lat: newValue};
          return holder;
        case 'coordinates.lon':
          holder.coordinates = {lon: newValue};
          return holder;
        case 'openingTimes[0].startAt':
          holder.openingTimes = [
            {
              startAt: newValue
            }
          ];
          return holder;
        case 'openingTimes[0].finishAt':
          holder.openingTimes = [
            {
              finishAt: newValue
            }
          ];
          return holder;
        case 'parent':
          holder.parent = newValue;
          return holder;
      }
    }

    this.update = function (id, param, value) {
      console.log('update', id, param, value);
      var data = setProp(param, value);

      console.log('data', data);

      return api.updateFestivalPlace(this.festivalId, id, data);
    };

    this.remove = function (id) {
      console.log('remove', id);

      //remove real elem
      if (id) {
        self.collection.places = self.collection.places.filter(function (elem) {
          return elem.id !== id;
        });

        return api.deleteFestivalPlace(this.festivalId, id);
        //return; //TODO
      }
    };

    this.emptyPlace = {
      name: '',
      coordinates: {
        lat: '',
        lon: ''
      },
      openingTimes: [
        {
          startAt: '',
          finishAt: ''
        }
      ],
      parent: {
        id: '',
        name: ''
      }
    };

    $scope.place = $scope.place || angular.copy(this.emptyPlace);

    this.save = function () {
      console.log('save', this.place);

      var data = angular.copy($scope.place);

      if (data.hasOwnProperty('parent')) {
        if (data.parent.hasOwnProperty('id') && data.parent.hasOwnProperty('name')) {
          if (!data.parent.id && !data.parent.name) {
            delete data.parent;
          }
          else {
            data.parent = data.parent.id;
          }
        }
      }

      if (data.hasOwnProperty('openingTimes')) {
        data.openingTimes = data.openingTimes.filter(function (opening) {
          if (opening.hasOwnProperty('startAt') && opening.hasOwnProperty('finishAt')) {
            return opening.startAt || opening.finishAt;
          }
        });
      }

      if (data.hasOwnProperty('coordinates')) {
        if (data.coordinates.hasOwnProperty('lat') && data.coordinates.hasOwnProperty('lon')) {
          if (!data.coordinates.lat && !data.coordinates.lon) {
            delete data.coordinates;
          }
        }
      }

      console.log('data', data);

      var deferred = api.createFestivalPlace(this.festivalId, data);

      deferred.then(function (value) {
        console.log('on save', value);
        self.reset();
        self.collection.places.push(value);
      });

      return deferred;
    };

    this.duplicate = function (id) {
      console.log('duplicate', id);

      var el = self.collection.places.filter(function (el) {
        return el.id === id;
      });

      if (el) {
        var place = el[0];
        console.log('duplicate place');
        console.log(place);


        delete place.id;
        delete place.$$hashKey;
        $scope.place = angular.copy(place);
      }
    };

    this.reset = function () {
      console.log('reset');
      $scope.place = angular.copy(self.emptyPlace);
    };

    //sorting
    $scope.sortType = 'name';
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
    $scope.search.limit = 50;

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

      return Math.ceil(self.collection.places.length / $scope.search.limit) - 1;
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
