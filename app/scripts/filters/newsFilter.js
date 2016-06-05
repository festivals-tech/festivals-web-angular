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
      //console.log(search);

      search = search || {};
      search.name = search.name || '';
      search.description = search.description || '';
      search.author_name = search.author_name || '';
      search.author_organization = search.author_organization || '';
      search.updatedAtFrom = search.updatedAtFrom || '';
      search.updatedAtTo = search.updatedAtTo || '';

      var result = [];
      angular.forEach(items, function (object/*, key*/) {

        var valid = true;

        switch (true) {
          case !!search.name:
            if (!object.name || object.name.indexOfInsensitive(search.name) === -1) {
              valid = false;
            }
          /* falls through */
          case !!search.description:
            if (!object.description || object.description.indexOfInsensitive(search.description) === -1) {
              valid = false;
            }
        }

        angular.forEach(object.authors, function (author/*, key2*/) {
          //console.log('second: ', location, key2);

          switch (true) {

            case !!search.author_name:

              if (!author.name || author.name.indexOfInsensitive(search.author_name) === -1) {
                valid = false;
              }
            /* falls through */
            case !!search.author_organization:
              if (!author.organization || author.organization.indexOfInsensitive(search.author_organization) === -1) {
                valid = false;
              }
          }
        });

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
