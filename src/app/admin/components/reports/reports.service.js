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
     *      sort - function (a, b) : return negative number, 0, or positive number for whether a is <, =, or > b, respectively
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

        while (p < prev.length && c < curr.length) {
            const sort = options.sort(prev[p], curr[c]);
            if (sort < 0) {
                ret.push('<li>Removed ' + options.write(prev[p]) + '</li>');
                p++;
            } else if (sort > 0) {
                ret.push('<li>Added ' + options.write(curr[c]) + '</li>');
                c++;
            } else if (sort === 0) {
                if (typeof options.compare === 'function' && options.compare(prev[p], curr[c])) {
                    ret.push('<li>' + options.change(prev[p], curr[c]) + '</li>');
                }
                p++;
                c++;
            } else {
                this.$log.debug('Invalid sort', prev[p], curr[c], sort);
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

    compare (previous, current, key) {
        return this.compareArrays(previous, current, this.getOptions(key));
    }

    getOptions (key) {
        switch (key) {
        case 'additionalSoftware':
            return {
                sort: (p, c) => p.name < c.name ? -1 : p.name > c.name ? 1 : 0,
                write: s => 'Relied Upon Software "' + s.name + '"',
                compare: (p, c) => p.version !== c.version || p.grouping !== c.grouping || p.certifiedProductNumber !== c.certifiedProductNumber || p.justification !== c.justification,
                change: (p, c) => {
                    let ret = 'Updated Relied Upon Software "' + p.name + '":<ul>';
                    if (p.version !== c.version) {
                        ret += '<li>Version changed from "' + p.version + '" to "' + c.version + '"</li>';
                    }
                    if (p.grouping !== c.grouping) {
                        ret += '<li>Grouping changed from "' + p.grouping + '" to "' + c.grouping + '"</li>';
                    }
                    if (p.certifiedProductNumber !== c.certifiedProductNumber) {
                        ret += '<li>CHPL Product Number changed from "' + p.certifiedProductNumber + '" to "' + c.certifiedProductNumber + '"</li>';
                    }
                    if (p.justification !== c.justification) {
                        ret += '<li>Justification changed from "' + p.justification + '" to "' + c.justification + '"</li>';
                    }
                    ret += '</ul>';
                    return ret;
                },
            };
        case 'meaningfulUseUserHistory':
            return {
                sort: (p, c) => p.muuDate - c.muuDate,
                write: m => 'MUU Count of ' + m.muuCount + ' on ' + this.$filter('date')(m.muuDate, 'mediumDate', 'UTC'),
                compare: (p, c) => p.muuCount !== c.muuCount,
                change: (p, c) => 'MUU Count changed from ' + p.muuCount + ' to ' + c.muuCount + ' on ' + this.$filter('date')(p.muuDate, 'mediumDate', 'UTC'),
            };
        case 'qmsStandards':
            return {
                sort: (p, c) => p.qmsStandardName < c.qmsStandardName ? -1 : p.qmsStandardName > c.qmsStandardName ? 1 : p.qmsModification < c.qmsModification ? -1 : p.qmsModification > c.qmsModification ? 1 : p.applicableCriteria < c.applicableCriteria ? -1 : p.applicableCriteria > c.applicableCriteria ? 1 : 0,
                write: q => 'QMS Standard "' + q.qmsStandardName + '" with modification "' + q.qmsModification + '" applicable to criteria: "' + q.applicableCriteria + '"',
            };
        case 'targetedUsers':
            return {
                sort: (p, c) => p.targetedUserName < c.targetedUserName ? -1 : p.targetedUserName > c.targetedUserName ? 1 : 0,
                write: t => 'Targeted User "' + t.targetedUserName + '"',
            };
        case 'testFunctionality':
            return {
                sort: (p, c) => p.name < c.name ? -1 : p.name > c.name ? 1 : 0,
                write: f => 'Test Functionality "' + f.name + '"',
            };
        default:
            return {
                sort: (p, c) => {
                    const key = Object.keys(p).filter((k, idx, arr) => typeof arr[k] === 'string').sort((a, b) => a < b ? -1 : a > b ? 1 : 0)[0];
                    return p[key] < c[key] ? -1 : p[key] > c[key] ? 1 : 0;
                },
                write: o => '<pre>' + angular.toJson(o) + '</pre>',
            };
        }
    }
}

angular.module('chpl.admin')
    .service('ReportService', ReportService);
