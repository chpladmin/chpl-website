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
}

angular
    .module('chpl.services')
    .service('DateUtil', DateUtil);
