'use strict';

/**
 * @ngdoc filter
 * @name festivalsWebApp.filter:festivalsFilter
 * @function
 * @description
 * # festivalsFilter
 * festivals filter in the festivalsWebApp.
 */
angular.module('festivalsWebApp')
  .filter('festivalsFilter', function () {
    return function (items, search) {
      //console.log(search);

      search = search || {};
      search.name = search.name || '';
      search.description = search.description || '';
      search.type = search.type || '';
      search.tag = search.tag || '';
      search.duration_startAtFrom = search.duration_startAtFrom || '';
      search.duration_startAtTo = search.duration_startAtTo || '';
      search.location_country = search.location_country || '';
      search.location_name = search.location_name || '';
      search.location_city = search.location_city || '';
      search.location_state = search.location_state || '';
      search.updatedAtFrom = search.updatedAtFrom || '';
      search.updatedAtTo = search.updatedAtTo || '';

      var result = [];
      angular.forEach(items, function (object, key) {

        var valid = true;

        switch (true) {
          case !!search.name:
            if (object.name.indexOfInsensitive(search.name) === -1) {
              valid = false;
            }
          case !!search.description:
            if (object.description.indexOfInsensitive(search.description) === -1) {
              valid = false;
            }
          case !!search.type:
            if (object.type.indexOfInsensitive(search.type) === -1) {
              valid = false;
            }
          case !!search.tag:

            var matchingTags = object.tags.filter(function (tag) {
              var t = tag;
              if (tag && tag.hasOwnProperty('text')) {
                t = tag.text;
              }
              return t.indexOfInsensitive(search.tag) > -1;
            });

            valid = valid && matchingTags.length > 0;
        }

        angular.forEach(object.locations, function (location, key2) {
          //console.log('second: ', location, key2);

          switch (true) {
            case !!search.location_country:
              if (location.country && location.country.indexOfInsensitive(search.location_country) === -1) {
                valid = false;
              }
            case !!search.location_name:
              if (location.name && location.name.indexOfInsensitive(search.location_name) === -1) {
                valid = false;
              }
            case !!search.location_city:
              if (location.city && location.city.indexOfInsensitive(search.location_city) === -1) {
                valid = false;
              }
            case !!search.location_state:
              if (location.state && location.state.indexOfInsensitive(search.location_state) === -1) {
                valid = false;
              }
          }
        });

        if (search.duration_startAtFrom || search.duration_startAtTo) {

          if (object.duration && object.duration.startAt) {
            valid = valid && checkDateRange(object.duration.startAt, search.duration_startAtFrom, search.duration_startAtTo);
          }
          else {
            valid = false;
          }
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
