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
            case 'apiDocumentation':
                return apiDocumentation(array.results);
            case 'bannedDevelopers':
                return bannedDevelopers(array.decertifiedDeveloperResults);
            case 'decertifiedProducts':
                return decertifiedProducts(array.results);
            case 'inactiveCertificates':
                return inactiveCertificates(array.results);
            case 'nonconformities':
                return nonconformities(array.results);
            case 'transparencyAttestations':
                return transparencyAttestations(array.developers);
                // no default
            }
        }

        ////////////////////////////////////////////////////////////////////
        // translation functions
        ////////////////////////////////////////////////////////////////////

        /*
         * Listings are part of this collection if:
         * - 2015 Edition and
         * - at least one of:
         *   - 170.315 (g)(7)
         *   - 170.315 (g)(8)
         *   - 170.315 (g)(9)
         */
        function apiDocumentation (array) {
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
         * All developers found are included, but need to be transformed
         */
        function bannedDevelopers (array) {
            var ret = [];
            var dev;
            for (var i = 0; i < array.length; i ++) {
                dev = {
                    acb: [],
                    decertificationDate: array[i].decertificationDate,
                    developer: array[i].developer.name,
                    mainSearch: array[i].developer.name,
                    status: array[i].developer.status.status,
                }
                for (var j = 0; j < array[i].certifyingBody.length; j++) {
                    dev.acb.push(array[i].certifyingBody[j].name);
                }
                ret.push(dev);
            }
            return ret;
        }

        /*
         * Listings are part of this collection if:
         * - 2014 or 2015 Edition and
         * - at least one of:
         *   - Withdrawn by Developer Under Surveillance/Review
         *   - Withdrawn by ONC-ACB
         *   - Terminated by ONC
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
         * - 2014 or 2015 Edition and
         * - Certification status = Withdrawn by Developer
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
         * - Surveillance Count > 0 and
         * - at least one of:
         *   - Open NC Count > 0
         *   - Closed NC Count > 0
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

        /*
         * All developers found are included, but need to be transformed
         */
        function transparencyAttestations (array) {
            var ret = [];
            var dev;
            for (var i = 0; i < array.length; i ++) {
                if (array[i].transparencyAttestations && array[i].transparencyAttestations.length > 0) {
                    dev = {
                        developer: array[i].name,
                        mainSearch: array[i].name,
                        transparencyAttestation: joinAttestations(array[i].transparencyAttestations),
                        disclosureUrl: [],
                    }
                    if (array[i].disclosureUrls && array[i].disclosuresUrls.length > 0) {
                        for (var j = 0; j < array[i].disclosureUrls.length; j++) {
                            dev.disclosureUrl.push(array[i].disclosuresUrls[j].name);
                        }
                    }
                    ret.push(dev);
                }
            }
            return ret;
        }

        ////////////////////////////////////////////////////////////////////
        // helper functions
        ////////////////////////////////////////////////////////////////////

        function expandAttestation (att) {
            switch (att) {
            case 'Affirmative': return '<span class="text-success">Supports</span>';
            case 'Negative': return '<span class="text-danger">Declined to Support</span>';
            case 'N/A': return '<span class="text-muted">Not Applicable</span>';
            default: return att;
            }
        }

        function joinAttestations (atts) {
            var ret = [];
            for (var i = 0; i < atts.length; i++) {
                if (atts[i].attestation) {
                    ret.push('<strong>' + atts[i].acbName + '</strong>: ' + expandAttestation(atts[i].attestation));
                }
            }
            if (ret.length === 0) {
                ret.push('<span class="text-danger">Has not fulfilled requirement</span>');
            }
            return ret.join('<br />');
        }
    }
})();
