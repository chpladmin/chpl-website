import '../../../node_modules/@js-joda/timezone'
import { Locale } from '../../../node_modules/@js-joda/locale_en-us';
import * as jsJoda from '../../../node_modules/@js-joda/core';

class DateUtil {
    constructor ($filter, $log) {
        'ngInject'
        this.$filter = $filter;
        this.$log = $log;
    }

    getDisplayDateFormat (date, fallback) {
        if (typeof(date) === 'number') {
            return this.$filter('date')(date, 'mediumDate', 'UTC');
        }
        if (date && date.month && date.dayOfMonth && date.year) {
            return [...date.month.toLowerCase()].map((w, i) => i === 0 ? w[0].toUpperCase() : w).join('').substring(0,3) + ' ' + date.dayOfMonth + ', ' + date.year;
        }
        return fallback || 'N/A';
    }

    longToZonedDateTime (dateLong, zone) {
        zone = zone || 'America/New_York';
        return jsJoda.ZonedDateTime.ofInstant(jsJoda.Instant.ofEpochMilli(dateLong), jsJoda.ZoneId.of(zone));
    }

    zonedDateTimeToLong (date) {
        return date.toInstant().toEpochMilli();
    }

    zonedDateTimeToString (date, format) {
        format = format || 'MMM d, y h:mm:ss a z';
        let formatter = jsJoda.DateTimeFormatter.ofPattern(format).withLocale(Locale.US);
        return date.format(formatter);
    }

    datePartsToZonedDateTime (year, month, day, localTime, zone) {
        zone = zone || 'America/New_York';
        localTime = localTime || jsJoda.LocalTime.MIDNIGHT;
        return jsJoda.ZonedDateTime.of3(jsJoda.LocalDate.of(year, month, day), localTime, jsJoda.ZoneId.of(zone));
    }

    jsJoda () {
        return jsJoda;
    }
}

angular
    .module('chpl.services')
    .service('DateUtil', DateUtil);
