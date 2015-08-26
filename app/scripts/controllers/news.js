'use strict';

/**
 * @ngdoc function
 * @name festivalsWebApp.controller:NewsCtrl
 * @description
 * # NewsCtrl
 * Controller of the festivalsWebApp
 */
angular.module('festivalsWebApp')
  .controller('NewsCtrl', function ($scope, $timeout, collection, api) {
    var self = this;

    this.collection = collection;
    this.statuses = ['', 'CREATED', 'PUBLISHED', 'CANCELED'];

    function setProp(path, newValue) {
      var holder = {};
      switch (path) {
        case 'name':
          holder.name = newValue;
          return holder;
        case 'status':
          holder.status = newValue;
          return holder;
        case 'description':
          holder.description = newValue;
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

      var el = collection.news.filter(function (el) {
        return el.id === id;
      });

      if (el) {
        var news = el[0];
        console.log('update tag for ' + news);

        var tags = news.tags.map(function (tag) {
          return tag.text;
        });

        var data = {
          tags: tags
        };

        //console.log('el', el);
        return api.updateNews(id, data);
      }
    };

    this.update = function (id, param, value) {
      console.log('update', id, param, value);
      var data = setProp(param, value);

      console.log('data', data);

      return api.updateNews(id, data);
    };

    this.remove = function (id) {
      console.log('remove', id);

      //remove real elem
      if (id) {
        collection.news = collection.news.filter(function (elem) {
          return elem.id !== id;
        });

        return api.deleteFestivalEvent(this.festivalId, id);
        //return; //TODO
      }
    };

    $scope.emptyNews = {
      name: '',
      description: '',
      tags: '',
      authors: [
        {
          name: '',
          organization: ''
        }
      ],
      mainImage: {
        large: ''
      }
    };

    $scope.news = $scope.news || $scope.emptyNews;

    this.save = function () {
      console.log('save', $scope.news);

      var data = angular.copy($scope.news);

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

      //console.log('data', data);

      var deferred = api.createNews(data);

      deferred.then(function (value) {
        console.log('on save', value);
        self.reset();
        collection.news.push(value);
      });

      return deferred;
    };

    this.duplicate = function (id) {
      console.log('duplicate', id);

      var el = collection.news.filter(function (el) {
        return el.id === id;
      });

      if (el) {
        var news = el[0];
        console.log('duplicate news');
        console.log(news);
      }

      delete news.id;
      delete news['$$hashKey'];
      $scope.news = angular.copy(news);
    };

    this.reset = function () {
      console.log('reset');
      $scope.news = angular.copy($scope.emptyNews);
    };

    //sorting

    $scope.sortReverse = true;
    $scope.sortType = 'publishedAt';

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
    $scope.search = {};
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

      return Math.ceil(collection.news.length / $scope.search.limit) - 1;
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
