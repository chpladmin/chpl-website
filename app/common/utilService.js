;(function () {
    'use strict';

    angular.module('app.common')
        .service('utilService', function ($log) {
            var self = this;

            self.extendSelect = extendSelect;
            self.sortCert = sortCert;
            self.sortCqm = sortCqm;
            self.sortNonconformityTypes = sortNonconformityTypes;
            self.sortRequirements = sortRequirements;

            ////////////////////////////////////////////////////////////////////

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
                    if (cqm.length === 4) {
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
                }
                return self.sortCert(type);
            }

            function sortRequirements (req) {
                if (angular.isObject(req)) {
                    req = req.requirement;
                }
                var edition = parseInt(req.substring(4,7));
                var letter = parseInt(req.split('(')[1].charCodeAt(0)) - 96;
                var number = req.length > 11 ? parseInt(req.split(')')[1].substring(1)) : 0;
                var ret = edition * 10000 +
                    letter * 100 +
                    number;
                return ret;
            }
        });
})();
