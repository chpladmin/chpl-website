class DateUtil {
    constructor ($filter, $log) {
        'ngInject'
        this.$filter = $filter;
        this.$log = $log;
    }

    getDisplayDateFormat (date) {
        switch (typeof(date)) {
        case 'object':
            return [...date.month.toLowerCase()].map((w, i) => i === 0 ? w[0].toUpperCase() : w).join('').substring(0,3) + ' ' + date.dayOfMonth + ', ' + date.year;
        case 'number':
            return this.$filter('date')(date, 'mediumDate', 'UTC');
        default:
            return date;
        }
    }
}

angular.module('chpl.services')
    .service('DateUtil', DateUtil);
