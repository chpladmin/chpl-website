import '../../../node_modules/@js-joda/timezone'
import { Locale } from '../../../node_modules/@js-joda/locale_en-us';
import * as jsJoda from '../../../node_modules/@js-joda/core';

class DateUtil {

    constructor ($filter, $log) {
        'ngInject'
        this.$filter = $filter;
        this.$log = $log;

        this._ZONE_ID = jsJoda.ZoneId.of('America/New_York');
    }

    getDisplayDateFormat (date, fallback) {
        if (typeof(date) === 'number') {
            return this.$filter('date')(date, 'mediumDate', 'UTC');
        }
        if (date && date.month && date.dayOfMonth && date.year) {
            return this.localDateTimeToString(this.datePartsToLocalDate(date.year, date.monthValue, date.dayOfMonth));
        }
        return fallback || 'N/A';
    }

    localDateTimeToString (date, format) {
        format = format || 'MMM d, y';
        let formatter = jsJoda.DateTimeFormatter.ofPattern(format).withLocale(Locale.US);
        return date.format(formatter);
    }

    longToZonedDateTime (dateLong) {
        return jsJoda.ZonedDateTime.ofInstant(jsJoda.Instant.ofEpochMilli(dateLong), this._ZONE_ID);
    }

    zonedDateTimeToLong (date) {
        return date.toInstant().toEpochMilli();
    }

    zonedDateTimeToString (date, format) {
        format = format || 'MMM d, y h:mm:ss a z';
        let formatter = jsJoda.DateTimeFormatter.ofPattern(format).withLocale(Locale.US);
        return date.format(formatter);
    }

    datePartsToZonedDateTime (year, month, day, localTime) {
        localTime = localTime || jsJoda.LocalTime.MIDNIGHT;
        let x = jsJoda.ZonedDateTime.of3(jsJoda.LocalDate.of(year, month, day), localTime, this._ZONE_ID);
        return x;
    }

    datePartsToLocalDate (year, month, day) {
        return jsJoda.LocalDate.of(year, month, day);
    }

    jsJoda () {
        return jsJoda;
    }
}

angular
    .module('chpl.services')
    .service('DateUtil', DateUtil);
