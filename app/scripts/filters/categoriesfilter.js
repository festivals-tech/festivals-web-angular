'use strict';

/**
 * @ngdoc filter
 * @name festivalsWebApp.filter:categoriesFilter
 * @function
 * @description
 * # categoriesFilter
 * Filter in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .filter('categoriesFilter', function () {
    return function (items, search) {
      //console.log(search);

      search = search || {};
      search.id = search.id || '';
      search.updatedAt = search.updatedAt || '';
      search.parent_id = search.parent_id || '';
      search.name = search.name || '';
      search.updatedAtFrom = search.updatedAtFrom || '';
      search.updatedAtTo = search.updatedAtTo || '';

      var result = [];
      angular.forEach(items, function (object/*, key*/) {

        var valid = true;

        switch (true) {
          case !!search.id:
            if (!object.id || object.id.indexOfInsensitive(search.id) === -1) {
              valid = false;
            }
          /* falls through */
          case !!search.parent_id:
            if (!object.parent_id || object.parent_id.indexOfInsensitive(search.parent_id) === -1) {
              valid = false;
            }
          /* falls through */
          case !!search.name:
            if (!object.name || object.name.indexOfInsensitive(search.name) === -1) {
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