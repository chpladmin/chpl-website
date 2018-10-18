export class ReportService {
    constructor ($filter, $log) {
        'ngInject';
        this.$filter = $filter;
        this.$log = $log;
    }

    /**
     * Compare two arrays.
     * previous & current are arrays of objects
     * options is an object containing functions
     *   required functions:
     *      sort - function (a, b) : return -1, 0, or 1 for whether a is <, =, or > b
     *      write - function (o) : return string of user friendly name of object o
     *   optional functions:
     *      compare - f (a, b) : return true iff a !== b and should be considered as a change
     *      change - f (p, c) : return string of user friendly description of change from p to c
     * Returns array of changes between the arrays
     */
    compareArrays (previous, current, options) {
        if (!Array.isArray(previous) || !Array.isArray(current)) {
            return [];
        }
        const ret = [];
        const prev = angular.copy(previous).sort(options.sort);
        const curr = angular.copy(current).sort(options.sort);
        let p = 0;
        let c = 0;

        this.$log.debug(Object.keys(options));
        while (p < prev.length && c < curr.length) {
            switch (options.sort(prev[p], curr[c])) {
            case -1:
                ret.push('<li>Removed ' + options.write(prev[p]) + '</li>');
                p++;
                break;
            case 1:
                ret.push('<li>Added ' + options.write(curr[c]) + '</li>');
                c++;
                break;
            case 0:
                this.$log.debug(options.compare, options.compare(p, c));
                if (options.compare && options.compare(p, c)) {
                    ret.push('<li>' + options.change(p, c) + '</li>');
                }
                p++;
                c++;
                break;
            default:
                p++;
                c++;
            }
        }
        while (c < curr.length) {
            ret.push('<li>Added ' + options.write(curr[c]) + '</li>');
            c++;
        }
        while (p < prev.length) {
            ret.push('<li>Removed ' + options.write(prev[p]) + '</li>');
            p++;
        }

        return ret;
    }

    compareMuuHistory (previous, current) {
        return this.compareArrays(previous, current, {
            sort: (p, c) => p.muuDate - c.muuDate,
            write: m => 'MUU Count of ' + m.muuCount + ' on ' + this.$filter('date')(m.muuDate, 'mediumDate', 'UTC'),
            compare: (p, c) => p.muuCount !== c.muuCount,
            change: (p, c) => 'MUU Count changed from ' + p.muuCount + ' to ' + c.muuCount + ' on ' + this.$filter('date')(p.muuDate, 'mediumDate', 'UTC'),
        });
    }

    compareQmsStandards (previous, current) {
        return this.compareArrays(previous, current, {
            sort: (p, c) => {
                return p.qmsStandardName < c.qmsStandardName ? -1 :
                    p.qmsStandardName > c.qmsStandardName ? 1 :
                    p.qmsModification < c.qmsModification ? -1 :
                    p.qmsModification > c.qmsModification ? 1 :
                    p.applicableCriteria < c.applicableCriteria ? -1 :
                    p.applicableCriteria > c.applicableCriteria ? 1 : 0;
            },
            write: q => 'QMS Standard "' + q.qmsStandardName + '" with modification "' + q.qmsModification + '" applicable to criteria: "' + q.applicableCriteria + '"',
        });
    }
}

angular.module('chpl.admin')
    .service('ReportService', ReportService);
