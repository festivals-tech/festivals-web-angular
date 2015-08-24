'use strict';

/**
 * @ngdoc function
 * @name festivalsWebApp.controller:CategoriesCtrl
 * @description
 * # CategoriesCtrl
 * Controller of the festivalsWebApp
 */
angular.module('festivalsWebApp')
  .controller('CategoriesCtrl', function ($scope, $timeout, $routeParams, collection, api) {

    this.festivalId = $routeParams.festivalId;

    $scope.parents = collection.categories.map(function (category) {
      return {
        name: category.name,
        id: category.id
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


    var getParent = function getParent(id, categories) {
      return categories
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
      categories: []
    };

    var self = this;
    this.collection.total = collection.total;
    this.collection.categories = collection.categories
      .map(function (category) {
        if (category.parent) {
          category.parent = getParent(category.parent, collection.categories);
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
      }
    }

    this.update = function (id, param, value) {
      console.log('update', id, param, value);
      var data = setProp(param, value);

      console.log('data', data);

      return api.updateFestivalCategory(this.festivalId, id, data);
    };

    this.remove = function (id) {
      console.log('remove', id);

      //remove real elem
      if (id) {
        self.collection.categories = self.collection.categories.filter(function (elem) {
          return elem.id !== id;
        });

        return api.deleteFestivalCategory(this.festivalId, id);
        //return; //TODO
      }
    };

    $scope.emptyCategory = {
      name: '',
      parent: {
        id: '',
        name: ''
      }
    };

    $scope.category = $scope.category || $scope.emptyCategory;

    this.save = function () {
      console.log('save', $scope.category);

      var data = angular.copy($scope.category);

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

      console.log('data', data);

      var deferred = api.createFestivalCategory(this.festivalId, data);

      deferred.then(function (value) {
        console.log('on save', value);
        self.reset();
        self.collection.categories.push(value);
      });

      return deferred;
    };

    this.duplicate = function (id) {
      console.log('duplicate', id);

      var el = self.collection.categories.filter(function (el) {
        return el.id === id;
      });

      if (el) {
        var category = el[0];
        console.log('duplicate category');
        console.log(category);
      }

      delete category.id;
      delete category['$$hashKey'];
      $scope.category = angular.copy(category);
    };

    this.reset = function () {
      console.log('reset');
      $scope.category = angular.copy($scope.emptyCategory);
    };


    //sorting
    $scope.sortType = 'name';
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

      return Math.ceil(self.collection.categories.length / $scope.search.limit) - 1;
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