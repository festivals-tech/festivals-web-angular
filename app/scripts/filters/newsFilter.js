'use strict';

/**
 * @ngdoc filter
 * @name festivalsWebApp.filter:newsFilter
 * @function
 * @description
 * # newsFilter
 * news filter in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .filter('newsFilter', function () {
    return function (items, search) {
      console.log(search);

      search = search || {};
      search.name = search.name || '';
      search.description = search.description || '';
      search.updatedAtFrom = search.updatedAtFrom || '';
      search.updatedAtTo = search.updatedAtTo || '';

      var result = [];
      angular.forEach(items, function (object, key) {

        var valid = true;

        switch (true) {
          case !!search.name:
            if (!object.name || object.name.indexOfInsensitive(search.name) === -1) {
              valid = false;
            }
          case !!search.description:
            if (!object.description || object.description.indexOfInsensitive(search.description) === -1) {
              valid = false;
            }
        }

        if (object.updatedAt) {
          valid = valid && checkDateRange(object.updatedAt, search.updatedAtFrom, search.updatedAtTo);
        }
        else {
          valid = false;
        }

        //console.log(valid);

        if (valid) {
          result.push(object);
        }
      });

      return result;

    };
  });
