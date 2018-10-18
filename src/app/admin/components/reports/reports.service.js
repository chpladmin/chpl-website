export class ReportService {
    constructor ($filter, $log) {
        'ngInject';
        this.$filter = $filter;
        this.$log = $log;
    }

    compareMuuHistory (previous, current) {
        if (!Array.isArray(previous) || !Array.isArray(current)) {
            return [];
        }
        const ret = [];
        const prev = angular.copy(previous).sort((a, b) => a.muuDate - b.muuDate);
        const curr = angular.copy(current).sort((a, b) => a.muuDate - b.muuDate);
        let p = 0;
        let c = 0;

        while (p <= prev.length && c <= curr.length && (p !== prev.length || c !== curr.length)) {
            this.$log.info(p, c);
            if (p === prev.length || c === curr.length) {
                if (p === prev.length) {
                    while (c < curr.length) {
                        this.$log.info('c', c);
                        ret.push('<li>Added MUU Count of ' + curr[c].muuCount + ' on ' + this.$filter('date')(curr[c].muuDate, 'mediumDate', 'UTC') + '</li>');
                        c++;
                    }
                } else if (c === curr.length) {
                    while (p < prev.length) {
                        this.$log.info('p', p);
                        ret.push('<li>Removed MUU Count of ' + prev[p].muuCount + ' from ' + this.$filter('date')(prev[p].muuDate, 'mediumDate', 'UTC') + '</li>');
                        p++;
                    }
                }
            } else if (prev[p].muuDate === curr[c].muuDate) {
                if (prev[p].muuCount !== curr[c].muuCount) {
                    ret.push('<li>MUU Count changed from ' + prev[p].muuCount + ' to ' + curr[c].muuCount + ' on ' + this.$filter('date')(prev[p].muuDate, 'mediumDate', 'UTC') + '</li>');
                }
                p++;
                c++;
            } else if (prev[p].muuDate < curr[c].muuDate) {
                ret.push('<li>Removed MUU Count of ' + prev[p].muuCount + ' from ' + this.$filter('date')(prev[p].muuDate, 'mediumDate', 'UTC') + '</li>');
                p++;
            } else if (prev[p].muuDate > curr[c].muuDate) {
                ret.push('<li>Added MUU Count of ' + curr[c].muuCount + ' on ' + this.$filter('date')(curr[c].muuDate, 'mediumDate', 'UTC') + '</li>');
                c++;
            }
        }
        return ret;
    }
}

angular.module('chpl.admin')
    .service('ReportService', ReportService);
