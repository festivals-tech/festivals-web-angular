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

    this.collection = collection || [];
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

      var el = self.collection.news.filter(function (el) {
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
        self.collection.news = self.collection.news.filter(function (elem) {
          return elem.id !== id;
        });

        return api.deleteFestivalEvent(this.festivalId, id);
        //return; //TODO
      }
    };

    self.emptyNews = {
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

    self.news = self.news || self.emptyNews;

    this.save = function () {
      console.log('save', self.news);

      var data = angular.copy(self.news);

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
        self.collection.news.push(value);
      });

      return deferred;
    };

    this.duplicate = function (id) {
      console.log('duplicate', id);

      var el = self.collection.news.filter(function (el) {
        return el.id === id;
      });

      if (el) {
        var news = el[0];
        console.log('duplicate news');
        console.log(news);
      }

      delete news.id;
      delete news['$$hashKey'];
      self.news = angular.copy(news);
    };

    this.reset = function () {
      console.log('reset');
      self.news = angular.copy(self.emptyNews);
    };

    //sorting

    self.sortReverse = true;
    self.sortType = 'publishedAt';

    this.toggleSort = function toggleSort(type) {
      self.sortType = type;
      self.sortReverse = !self.sortReverse;
    };

    this.isSortAsc = function isSortAsc(type) {
      if (type === self.sortType) {
        return self.sortReverse;
      }
      return false;
    };

    this.isSortDesc = function isSortDesc(type) {
      if (type === self.sortType) {
        return !self.sortReverse;
      }
      return false;
    };

    //pagination
    self.currentPage = 0;
    self.search = {};
    self.search.offset = 0;
    self.search.limit = 10;

    this.prevPage = function () {
      if (self.currentPage > 0) {
        self.currentPage--;
        this.setPage(self.currentPage);
      }
    };

    this.setPage = function (page) {
      self.currentPage = page;
      self.search.offset = self.currentPage * self.search.limit;
    };

    this.prevPageDisabled = function () {
      return self.currentPage === 0 ? "disabled" : "";
    };

    this.pageCount = function () {
      if (!self.search.limit) {
        return 0;
      }

      return Math.ceil(self.collection.news.length / self.search.limit) - 1;
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
      if (self.currentPage < this.pageCount()) {
        self.currentPage++;
        this.setPage(self.currentPage);
      }
    };

    this.nextPageDisabled = function () {
      return self.currentPage === this.pageCount() ? "disabled" : "";
    };

  });
