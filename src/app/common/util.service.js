(function () {
    'use strict';

    angular.module('chpl.common')
        .service('utilService', utilService);

    /** @ngInject */
    function utilService () {
        var self = this;

        self.arrayCompare = arrayCompare;
        self.extendSelect = extendSelect;
        self.sortCert = sortCert;
        self.sortCqm = sortCqm;
        self.sortNonconformityTypes = sortNonconformityTypes;
        self.sortRequirements = sortRequirements;

        ////////////////////////////////////////////////////////////////////

        function arrayCompare (before, after, key) {
            var ret = {
                added: [],
                edited: [],
                removed: []
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

        function extendSelect (options, value) {
            var newValue = { name: value };
            var addingNew = true;
            for (var i = 0; i < options.length; i++) {
                if (angular.isUndefined(options[i].id)) {
                    options[i] = newValue;
                    addingNew = false;
                }
            }
            if (addingNew) {
                options.push(newValue);
            }
            return options;
        }

        function sortCert (cert) {
            if (angular.isObject(cert)) {
                cert = cert.name;
            }
            var edition = parseInt(cert.substring(4,7));
            var letter = parseInt(cert.substring(9,10).charCodeAt(0)) - 96;
            var number = cert.length > 11 ? parseInt(cert.split(')')[1].substring(1)) : 0;
            var ret = edition * 10000 +
                letter * 100 +
                number;
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

        function sortNonconformityTypes (type) {
            if (type.name === 'Other Non-Conformity') {
                return Number.MAX_VALUE;
            } else if (type.name === 'Other Requirement') {
                return 0;
            }
            return self.sortCert(type);
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
    }
})();
