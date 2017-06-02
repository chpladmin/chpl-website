(function () {
    'use strict';

    angular.module('chpl.collections')
        .factory('collectionsService', collectionsService);

    /** @ngInject */
    function collectionsService () {
        var service = {
            translate: translate,
        }
        return service;

        ////////////////////////////////////////////////////////////////////

        function translate (key, array) {
            switch (key) {
            case 'apiCriteria':
                return apiCriteria(array);
            case 'decertifiedProducts':
                return decertifiedProducts(array);
            case 'inactiveCertificates':
                return inactiveCertificates(array);
            case 'nonconformities':
                return nonconformities(array);
            }
        }

        ////////////////////////////////////////////////////////////////////

        /*
         * Listings are part of this collection if:
            - 2015 Edition and
            - at least one of:
              - 170.315 (g)(7)
              - 170.315 (g)(8)
              - 170.315 (g)(9)
         */
        function apiCriteria (array) {
            var ret = [];
            var cp;
            for (var i = 0; i < array.length; i ++) {
                cp = array[i];
                if (cp.edition === '2015' && (cp.criteriaMet.indexOf('170.315 (g)(7)') > -1 || cp.criteriaMet.indexOf('170.315 (g)(8)') > -1 || cp.criteriaMet.indexOf('170.315 (g)(9)') > -1)) {

                    cp.mainSearch = [cp.developer, cp.product, cp.version, cp.chplProductNumber].join('|');

                    ret.push(cp);
                }
            }
            return ret;
        }

        /*
         * Listings are part of this collection if:
            - 2014 or 2015 Edition and
            - at least one of:
              -  Withdrawn by Developer Under Surveillance/Review
              -  Withdrawn by ONC-ACB
              -  Terminated by ONC
         */
        function decertifiedProducts (array ) {
            var ret = [];
            var cp;
            var statuses = [
                'Withdrawn by Developer Under Surveillance/Review',
                'Withdrawn by ONC-ACB',
                'Terminated by ONC',
            ];
            for (var i = 0; i < array.length; i ++) {
                cp = array[i];
                if (cp.edition !== '2011' && statuses.indexOf(cp.certificationStatus) > -1) {

                    cp.mainSearch = [cp.developer, cp.product, cp.version, cp.chplProductNumber].join('|');

                    ret.push(cp);
                }
            }
            return ret;
        }

                /*
         * Listings are part of this collection if:
            - 2014 or 2015 Edition and
            - Certification status =
              -  Withdrawn by Developer
         */
        function inactiveCertificates (array ) {
            var ret = [];
            var cp;
            var statuses = [
                'Withdrawn by Developer',
            ];
            for (var i = 0; i < array.length; i ++) {
                cp = array[i];
                if (cp.edition !== '2011' && statuses.indexOf(cp.certificationStatus) > -1) {

                    cp.mainSearch = [cp.developer, cp.product, cp.version, cp.chplProductNumber].join('|');

                    ret.push(cp);
                }
            }
            return ret;
        }

        /*
         * Listings are part of this collection if:
            - Surveillance Count > 0 and
            - at least one of:
              - Open NC Count > 0
              - Closed NC Count > 0
         */
        function nonconformities (array) {
            var ret = [];
            var cp;
            for (var i = 0; i < array.length; i ++) {
                cp = array[i];

                if (cp.surveillanceCount > 0 && (cp.openNonconformityCount > 0 || cp.closedNonconformityCount > 0)) {

                    cp.mainSearch = [cp.developer, cp.product, cp.version, cp.chplProductNumber].join('|');

                    ret.push(cp);
                }
            }
            return ret;
        }
    }
})();
