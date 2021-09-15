import '../../../node_modules/@js-joda/timezone';
import { Locale } from '../../../node_modules/@js-joda/locale_en-us';
import * as jsJoda from '../../../node_modules/@js-joda/core';

const isLocalDate = (dateToTest) => {
  try {
    jsJoda.LocalDate.parse(dateToTest);
    return true;
  } catch (err) {
    return false;
  }
};

class DateUtil {
  constructor($filter, $log) {
    'ngInject';

    this.$filter = $filter;
    this.$log = $log;

    this.ZONE_ID = jsJoda.ZoneId.of('America/New_York');

    this.TimeOfDay = {
      BEGINNING_OF_DAY: 'min',
      END_OF_DAY: 'max',
      NOON: 'noon',
    };
  }

  getCertificationDay(listing) {
    return this.getDisplayDateFormat(listing.certificationDate);
  }

  getDisplayDateFormat(date, fallback) {
    if (typeof (date) === 'number') {
      return this.$filter('date')(date, 'mediumDate', 'UTC');
    } if (typeof (date) === 'string' && isLocalDate(date)) {
      return this.localDateToString(date, 'MMM d, y');
    }
    return fallback || 'N/A';
  }

  datePartsToTimestamp(year, month, day, hour, minute, second, nano) {
    let time;
    switch (arguments.length) {
      case 4:
        time = this.localTimeFromTimeOfDay(hour);
        break;
      case 7:
        time = jsJoda.LocalTime.of(hour, minute, second, nano);
        break;
      default:
        time = jsJoda.LocalTime.MIN;
    }
    return jsJoda.ZonedDateTime.of3(jsJoda.LocalDate.of(year, month, day), time, this.ZONE_ID).toInstant().toEpochMilli();
  }

  updateTimePortionOfTimestamp(timestamp, newHour, newMinute, newSecond, newNano) {
    let time;
    switch (arguments.length) {
      case 2:
        time = this.localTimeFromTimeOfDay(newHour);
        break;
      case 5:
        time = jsJoda.LocalTime.of(newHour, newMinute, newSecond, newNano);
        break;
      default:
        return jsJoda.LocalTime.MIN;
    }
    return this.timestampToZonedDateTime(timestamp).with(time).toInstant().toEpochMilli();
  }

  timestampToString(timestamp, format = 'MMM d, y h:mm:ss a z') {
    const formatter = jsJoda.DateTimeFormatter.ofPattern(format).withLocale(Locale.US);
    return this.timestampToZonedDateTime(timestamp).format(formatter);
  }

  localDateToTimestamp(localDateString) {
    const localDate = jsJoda.LocalDate.parse(localDateString);
    const localTime = jsJoda.LocalTime.MIDNIGHT;
    return jsJoda.ZonedDateTime.of3(localDate, localTime, this.ZONE_ID).toInstant().toEpochMilli();
  }

  localDateToString(localDateString, format = 'MM/dd/yyyy') {
    if (localDateString) {
      return this.timestampToString(this.localDateToTimestamp(localDateString), format);
    }
    return null;
  }

  localTimeFromTimeOfDay(timeOfDay) {
    switch (timeOfDay) {
      case this.TimeOfDay.BEGINNING_OF_DAY:
        return jsJoda.LocalTime.MIN;
      case this.TimeOfDay.END_OF_DAY:
        return jsJoda.LocalTime.MAX;
      case this.TimeOfDay.NOON:
        return jsJoda.LocalTime.NOON;
      default:
        return jsJoda.LocalTime.MIN;
    }
  }

  timestampToZonedDateTime(dateLong) {
    return jsJoda.ZonedDateTime.ofInstant(jsJoda.Instant.ofEpochMilli(dateLong), this.ZONE_ID);
  }
}

angular.module('chpl.services')
  .service('DateUtil', DateUtil);
