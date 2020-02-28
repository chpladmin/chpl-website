(() => {
    'use strict';

    angular.module('chpl.services')
        .factory('utilService', utilService);

    /** @ngInject */
    function utilService ($filter, $log, Blob, FileSaver) {
        var service = {
            addDays: addDays,
            addNewValue: addNewValue,
            addressRequired: addressRequired,
            arrayCompare: arrayCompare,
            arrayToCsv: arrayToCsv,
            certificationStatus: certificationStatus,
            extendSelect: extendSelect,
            findModel: findModel,
            isBlank: isBlank,
            makeCsv: makeCsv,
            muuCount: muuCount,
            passwordClass: passwordClass,
            passwordTitle: passwordTitle,
            range: range,
            rangeCol: rangeCol,
            sortCert: sortCert,
            sortCertActual: sortCertActual,
            sortCertArray: sortCertArray,
            sortCqm: sortCqm,
            sortCqmActual: sortCqmActual,
            sortNonconformityTypes: sortNonconformityTypes,
            sortOtherNonconformityTypes: sortOtherNonconformityTypes,
            sortRequirements: sortRequirements,
            sortTestFunctionality: sortTestFunctionality,
            statusFont: statusFont,
            ternaryFilter: ternaryFilter,
        };
        return service;

        ////////////////////////////////////////////////////////////////////

        function addDays (date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }

        function addNewValue (array, object) {
            if (!array) {
                array = [];
            }
            if (object && !angular.equals(object, {})) {
                array.push(angular.copy(object));
            }
            return array;
        }

        function addressRequired (address) {
            if (!address) { return false; }
            if (address.line1 && address.line1.length > 0) { return true; }
            if (address.line2 && address.line2.length > 0) { return true; }
            if (address.city && address.city.length > 0) { return true; }
            if (address.state && address.state.length > 0) { return true; }
            if (address.zipcode && address.zipcode.length > 0) { return true; }
            if (address.country && address.country.length > 0) { return true; }
            return false;
        }

        function arrayCompare (before, after, key) {
            var ret = {
                added: [],
                edited: [],
                removed: [],
            };
            if (angular.isUndefined(key)) { key = 'id'; }
            var i,j;
            var added, removed;
            var count = Math.max(
                angular.isArray(before) ? before.length : 0,
                angular.isArray(after) ? after.length : 0
            );

            for (i = 0; i < count; i++) {
                // check after[i] against before
                if (after && angular.isDefined(after[i])) {
                    added = true;
                    if (before) {
                        for (j = 0; j < before.length; j++) {
                            // if equal, then not added
                            if (angular.equals(after[i],before[j])) { added = false; }
                            // if not equal, but have equal ids, then edited
                            else if (angular.isDefined(after[i][key]) &&
                                     angular.isDefined(before[j][key]) &&
                                     after[i][key] === before[j][key]) {
                                added = false;
                                ret.edited.push({before: before[j], after: after[i]});
                            }
                        }
                    }
                    if (added) {
                        ret.added.push(after[i]);
                    }
                }
                // check before[i] against after
                if (before && angular.isDefined(before[i])) {
                    removed = true;
                    if (after) {
                        for (j = 0; j < after.length; j++) {
                            // if equal, then not added
                            if (angular.equals(before[i], after[j])) { removed = false; }
                            // if not equal, but have equal ids, then edited
                            else if (angular.isDefined(before[i][key]) &&
                                     angular.isDefined(after[j][key]) &&
                                     before[i][key] === after[j][key]) { removed = false; }
                        }
                    }
                    if (removed) {
                        ret.removed.push(before[i]);
                    }
                }
            }
            return ret;
        }

        function arrayToCsv (data) {
            return data.map(row => {
                return row.map(cell => {
                    if (typeof(cell) === 'string' &&
                        (cell.indexOf('"') > -1 ||
                         cell.indexOf(',') > -1 ||
                         cell.indexOf('\n') > -1)) {
                        return '"' + cell.replace(/"/g,'""') + '"';
                    } else {
                        return cell;
                    }
                })
                    .join(',');
            })
                .join('\n');

        }

        function certificationStatus (listing, options) {
            if (listing.certificationEvents && listing.certificationEvents.length > 0) {
                if (options && options.editing) {
                    return $filter('orderBy')(listing.certificationEvents.map(event => { event.eventDate = event.statusDateObject.getTime(); return event; }),'-eventDate')[0].status.name;
                }
                return $filter('orderBy')(listing.certificationEvents,'-eventDate')[0].status.name;
            }
            return '';
        }

        function extendSelect (options, value) {
            for (var i = 0; i < options.length; i++) {
                if (options[i].name === value) {
                    return;
                }
            }
            options.push({name: value});
        }

        function findModel (item, options, key = 'id') {
            const ret = options.filter(option => item[key] === option[key]);
            if (ret.length === 1) {
                return ret[0];
            } else {
                return item;
            }
        }

        function makeCsv (data) {
            var blob = new Blob([this.arrayToCsv(data.values)], {
                type: 'application/csv',
            });
            FileSaver.saveAs(blob, data.name);
        }

        function muuCount (muuHistory) {
            return muuHistory.sort((a, b) => b.muuDate - a.muuDate)[0];
        }

        function passwordClass (strength) {
            switch (strength) {
            case 0:
                return 'danger';
            case 1:
                return 'danger';
            case 2:
                return 'warning';
            case 3:
                return 'warning';
            case 4:
                return 'success';
            default:
                return '';
            }
        }

        function passwordTitle (strength) {
            switch (strength) {
            case 0:
                return 'Awful';
            case 1:
                return 'Weak';
            case 2:
                return 'Moderate';
            case 3:
                return 'Strong';
            case 4:
                return 'Excellent';
            default:
                return '';
            }
        }

        function range (max, step) {
            step = parseInt(step, 10) || 1;
            let ret = [];
            for (let i = 0; i < max; i += step) {
                ret.push(i);
            }
            return ret;
        }

        function rangeCol (count) {
            switch (parseInt(count, 10)) {
            case 1:
                return 'col-sm-12';
            case 2:
                return 'col-sm-6';
            case 3:
                return 'col-sm-4';
            case 4:
            case 5:
                return 'col-sm-3';
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                return 'col-sm-2';
            case 12:
                return 'col-sm-1';
            default:
                return 'col-sm-12';
            }
        }

        function sortCert (cert) {
            let title = '';
            if (angular.isObject(cert)) {
                if (cert.title) {
                    title = cert.title;
                }
                cert = cert.name || cert.number
            } else if (cert.indexOf(':') > 0) {
                let vals = cert.split(':');
                cert = vals[0];
                title = vals[1];
            }
            const edition = parseInt(cert.substring(4,7));
            const letter = parseInt(cert.substring(9,10).charCodeAt(0)) - 96;
            const number = cert.length > 11 ? parseInt(cert.split(')')[1].substring(1)) : 0;
            const ret = edition * 1000000 +
                  letter * 10000 +
                  number * 100 +
                  title.length;
            return ret;
        }

        function sortCertActual (a, b) {
            return sortCert(a) - sortCert(b);
        }

        function sortCertArray (array) {
            var ret = Number.MIN_VALUE;
            if (array.length > 0) {
                ret = this.sortCert(array[0]);
            }
            return ret;
        }

        function sortCqm (cqm) {
            if (angular.isObject(cqm)) {
                cqm = cqm.name;
                if (cqm.substring(0,3) !== 'CMS') {
                    cqm = 'NQF-' + cqm;
                }
            }
            var edition = 1000 * cqm.indexOf('-');
            var num = parseInt(edition > 0 ? cqm.substring(4) : cqm.substring(3));
            var ret = edition + num;
            return ret;
        }

        function sortCqmActual (a, b) {
            return sortCqm(a) - sortCqm(b);
        }

        function sortNonconformityTypes (type) {
            if (type.number === 'Other Non-Conformity') {
                return Number.MAX_VALUE;
            }
            return sortCert(type);
        }

        function sortOtherNonconformityTypes (type) {
            if (type === 'Other Non-Conformity') {
                return Number.MAX_VALUE;
            }
            return sortCert(type);
        }

        function sortRequirements (req) {
            if (angular.isObject(req)) {
                req = req.requirement;
            }
            if (req.indexOf('(') < 0) {
                return Number.MAX_VALUE;
            }
            var edition = parseInt(req.substring(4,7));
            var letter = parseInt(req.split('(')[1].charCodeAt(0)) - 96;
            var number = req.length > 11 ? parseInt(req.split(')')[1].substring(1)) : 0;
            var ret = edition * 10000 +
                letter * 100 +
                number;
            return ret;
        }

        function sortTestFunctionality (tfA, tfB) {
            let matcher = /^\((.+?)\)/;
            let a = tfA.name;
            let b = tfB.name;
            while (a && a.length > 0 && b && b.length > 0) {
                let aVals = a.match(matcher);
                let bVals = b.match(matcher);
                if (aVals && bVals) {
                    let testA = isNaN(parseInt(aVals[0], 10)) ? aVals[0] : parseInt(aVals[0], 10);
                    let testB = isNaN(parseInt(bVals[0], 10)) ? bVals[0] : parseInt(bVals[0], 10);
                    if (testA < testB) { return -1; }
                    if (testA > testB) { return 1; }
                    a = a.replace(aVals[0], '');
                    b = b.replace(bVals[0], '');
                } else {
                    if (aVals) { return -1; }
                    if (bVals) { return 1; }
                }
            }
            if (a.length > 0) { return 1; }
            if (b.length > 0) { return -1; }
            return 0;
        }

        function statusFont (status) {
            var ret;
            switch (status) {
            case 'Active':
                ret = 'fa-check-circle status-good';
                break;
            case 'Retired':
                ret = 'fa-university status-neutral';
                break;
            case 'Suspended by ONC':
                ret = 'fa-minus-square status-warning';
                break;
            case 'Suspended by ONC-ACB':
                ret = 'fa-minus-circle status-warning';
                break;
            case 'Terminated by ONC':
                ret = 'fa-window-close status-bad';
                break;
            case 'Withdrawn by Developer Under Surveillance/Review':
                ret = 'fa-exclamation-circle status-bad';
                break;
            case 'Withdrawn by Developer':
                ret = 'fa-stop-circle status-neutral';
                break;
            case 'Withdrawn by ONC-ACB':
                ret = 'fa-times-circle status-bad';
                break;
                // no default
            }
            return ret;
        }

        function ternaryFilter (field) {
            if (field === null) {
                return 'N/A';
            } else {
                return field ? 'True' : 'False';
            }
        }

        function isBlank (x) {
            if (typeof x === 'string' || x === undefined || x === null) {
                return !x || x.trim().length === 0;
            } else if (Array.isArray(x)) {
                return !x.length;
            } else if (typeof x === 'object' && x.constructor === Object) {
                return !Object.keys(x).length;
            }
            return false;
        }
    }
})();
