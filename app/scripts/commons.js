'use strict';

String.prototype.indexOfInsensitive = function (s, b) {
  return this.toLowerCase().indexOf(s.toLowerCase(), b);
};

var checkDateRange = function checkDateRange(date, from, to) { // jshint ignore:line
  var valid = true;
  var momentFrom = null;
  var momentTo = null;
  var momentDate = null;

  if (from) {
    momentFrom = moment(from, 'DD-MM-YYYY').hours(0).minutes(0).seconds(0);
  }

  if (to) {
    momentTo = moment(to, 'DD-MM-YYYY').hours(23).minutes(59).seconds(59);
  }

  if (date) {
    momentDate = moment(date);
  }

  if (momentFrom && momentTo) {
    if (!momentDate || !momentDate.isBetween(momentFrom, momentTo)) {
      valid = false;
    }
  }
  else if (momentFrom && !momentTo) {
    if (!momentDate || !momentDate.isAfter(momentFrom)) {
      valid = false;
    }
  }
  else if (!momentFrom && momentTo) {
    if (!momentDate || !momentDate.isBefore(momentTo)) {
      valid = false;
    }
  }

  return valid;
};