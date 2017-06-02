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
    }
})();
