'use strict';

/**
 * @ngdoc filter
 * @name festivalsWebApp.filter:eventsFilter
 * @function
 * @description
 * # eventsFilter
 * Filter in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .filter('eventsFilter', function () {
    return function (items, search) {
      //console.log(search);

      search = search || {};
      search.id = search.id || '';
      search.name = search.name || '';
      search.description = search.description || '';
      search.tag = search.tag || '';
      search.place_name = search.place_name || '';
      search.category_name = search.category_name || '';
      search.duration_startAtFrom = search.duration_startAtFrom || '';
      search.duration_startAtTo = search.duration_startAtTo || '';
      search.author_name = search.author_name || '';
      search.author_organization = search.author_organization || '';
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
          case !!search.name:
            if (!object.name || object.name.indexOfInsensitive(search.name) === -1) {
              valid = false;
            }
          /* falls through */
          case !!search.description:
            if (!object.description || object.description.indexOfInsensitive(search.description) === -1) {
              valid = false;
            }
          /* falls through */
          case !!search.tag:

            var matchingTags = object.tags.filter(function (tag) {
              var t = tag;
              if (tag && tag.hasOwnProperty('text')) {
                t = tag.text;
              }
              return t.indexOfInsensitive(search.tag) > -1;
            });

            valid = valid && matchingTags.length > 0;
          /* falls through */
          case !!search.place_name:
            if (!object.place || !object.place.name || object.place.name.indexOfInsensitive(search.place_name) === -1) {
              valid = false;
            }
          /* falls through */
          case !!search.category_name:
            if (!object.category || !object.category.name || object.category.name.indexOfInsensitive(search.category_name) === -1) {
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

        if (object.duration && object.duration.startAt) {
          valid = valid && checkDateRange(object.duration.startAt, search.duration_startAtFrom, search.duration_startAtTo);
        }
        else {
          valid = false;
        }

        if (search.updatedAtFrom || search.updatedAtTo) {

          if (object.updatedAt) {
            valid = valid && checkDateRange(object.updatedAt, search.updatedAtFrom, search.updatedAtTo);
          }
          else {
            valid = false;
          }
        }

        //console.log('valid', valid);

        if (valid) {
          result.push(object);
        }
      });

      return result;

    };
  });
