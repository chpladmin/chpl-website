(function () {
    'use strict';

    angular.module('chpl.collections')
        .factory('collectionsService', collectionsService);

    /** @ngInject */
    function collectionsService ($log, utilService, SPLIT_PRIMARY, SPLIT_SECONDARY) {
        var service = {
            translate: translate,
        }
        return service;

        ////////////////////////////////////////////////////////////////////

        function translate (key, data) {
            switch (key) {
            case 'apiDocumentation':
                return apiDocumentation(data.results, data.certificationCriteria);
            case 'bannedDevelopers':
                return bannedDevelopers(data);
            case 'correctiveAction':
                return correctiveActions(data.results);
            case 'decertifiedProducts':
                return decertifiedProducts(data.results);
            case 'inactiveCertificates':
                return inactiveCertificates(data.results);
            case 'sed':
                return sed(data.results, data.certificationCriteria);
            case 'transparencyAttestations':
                return transparencyAttestations(data);
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
         *   - 170.315 (g)(10)
         */
        function apiDocumentation (listings, certificationCriteria) {
            let applicableCriteria = certificationCriteria
                .filter(cc => ((cc.number === '170.315 (g)(7)' && cc.title === 'Application Access - Patient Selection')
                               || (cc.number === '170.315 (g)(8)' && cc.title === 'Application Access - Data Category')
                               || (cc.number === '170.315 (g)(9)' && cc.title === 'Application Access - All Data Request')
                               || (cc.number === '170.315 (g)(9)' && cc.title === 'Application Access - All Data Request (Cures Update)')
                               || (cc.number === '170.315 (g)(10)' && cc.title === 'Standardized API for Patient and Population Services')))
                .map(cc => SPLIT_PRIMARY + cc.id + SPLIT_PRIMARY);
            let ret = listings.filter(listing => applicableCriteria.some(id => (SPLIT_PRIMARY + listing.criteriaMet + SPLIT_PRIMARY).indexOf(id) > -1))
                .map(listing => {
                    listing.mainSearch = [listing.developer, listing.product, listing.version, listing.chplProductNumber].join('|');
                    listing.apiDocumentation = listing.apiDocumentation
                        .split(SPLIT_PRIMARY)
                        .map(item => {
                            let ret = {};
                            const data = item.split(SPLIT_SECONDARY);
                            ret.criteria = certificationCriteria.find(cc => (cc.id + '') === data[0]);
                            ret.url = data[1];
                            return ret;
                        })
                        .sort((a, b) => utilService.sortCert(a.criteria) - utilService.sortCert(b.criteria))
                        .map(object => object.criteria.number + (object.criteria.title.indexOf('Cures Update') > 0 ? ' (Cures Update)' : '') + SPLIT_SECONDARY + object.url)
                        .join(SPLIT_PRIMARY);
                    return listing;
                });
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
                    developer: array[i].developerName,
                    mainSearch: array[i].developerName,
                }
                for (var j = 0; j < array[i].acbNames.length; j++) {
                    dev.acb.push(array[i].acbNames[j]);
                }
                ret.push(dev);
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
        function correctiveActions (array) {
            var ret = [];
            var cp;
            for (var i = 0; i < array.length; i ++) {
                cp = array[i];

                if (cp.surveillanceCount > 0 && (cp.openNonconformityCount > 0 || cp.closedNonconformityCount > 0)) {

                    cp.mainSearch = [cp.developer, cp.product, cp.version, cp.chplProductNumber].join('|');
                    cp.nonconformities = angular.toJson({
                        openNonconformityCount: cp.openNonconformityCount,
                        closedNonconformityCount: cp.closedNonconformityCount,
                    });

                    ret.push(cp);
                }
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
         * - Certification status = Withdrawn by Developer
         */
        function inactiveCertificates (array ) {
            return array
                .filter(cp => cp.certificationStatus === 'Withdrawn by Developer')
                .map(cp => {
                    cp.mainSearch = [cp.developer, cp.product, cp.version, cp.chplProductNumber].join('|');
                    return cp;
                });
        }

        /*
         * Listings are part of this collection if:
         *   they have 170.315 (g)(3)
         */
        function sed (array, certificationCriteria) {
            let applicableCriteria = certificationCriteria
                .filter(cc => (cc.number === '170.315 (g)(3)' && cc.title === 'Safety-Enhanced Design'))
                .map(cc => SPLIT_PRIMARY + cc.id + SPLIT_PRIMARY);
            let ret = array.filter(listing => applicableCriteria.some(id => (SPLIT_PRIMARY + listing.criteriaMet + SPLIT_PRIMARY).indexOf(id) > -1))
                .map(listing => {
                    listing.mainSearch = [listing.developer, listing.product, listing.version, listing.chplProductNumber].join('|');
                    return listing;
                });
            return ret;
        }

        /*
         * Only developers with Listings that are Active or Suspended by ONC/ONC-ACB are included, and need to be transformed
         */
        function transparencyAttestations (array) {
            var ret = [];
            var dev;
            for (var i = 0; i < array.length; i ++) {
                if (array[i].listingCounts.active > 0 ||
                    array[i].listingCounts.suspendedByOncAcb > 0 ||
                    array[i].listingCounts.suspendedByOnc > 0) {
                    dev = {
                        name: array[i].name,
                        mainSearch: array[i].name,
                        acbAttestations: joinAttestations(array[i].acbAttestations),
                        transparencyAttestationUrls: array[i].transparencyAttestationUrls ? array[i].transparencyAttestationUrls.split(SPLIT_PRIMARY) : [],
                        acb: findAcbs(array[i].acbAttestations),
                    }
                    ret.push(dev);
                }
            }
            return ret;
        }

        ////////////////////////////////////////////////////////////////////
        // helper functions
        ////////////////////////////////////////////////////////////////////

        function expandAttestation (att, acb) {
            switch (att) {
            case 'Affirmative': return '<span class="text-success">Supports (' + acb + ')</span>';
            case 'Negative': return '<span class="text-danger">Declined to Support (' + acb + ')</span>';
            case 'N/A': return '<span class="text-muted">Not Applicable (' + acb + ')</span>';
            default: return att;
            }
        }

        function findAcbs (atts) {
            var ret = []
            if (atts) {
                var items = atts.split(SPLIT_PRIMARY);
                var item;
                for (var i = 0; i < items.length; i++) {
                    item = items[i].split(':');
                    ret.push(item[0]);
                }
            }
            return ret.join(SPLIT_PRIMARY);
        }

        function joinAttestations (atts) {
            var ret = [];
            if (atts) {
                var items = atts.split(SPLIT_PRIMARY);
                var item;
                for (var i = 0; i < items.length; i++) {
                    item = items[i].split(':');
                    if (item[1]) {
                        ret.push(expandAttestation(item[1], item[0]));
                    }
                }
            }
            if (ret.length === 0) {
                ret.push('<span class="text-danger">Has not fulfilled requirement</span>');
            }
            return ret.join('<br />');
        }
    }
})();
