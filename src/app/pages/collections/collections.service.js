(function () {
  'use strict';

  angular.module('chpl.collections')
    .factory('collectionsService', collectionsService);

  /** @ngInject */
  function collectionsService ($log, SPLIT_PRIMARY, SPLIT_SECONDARY, utilService) {
    var service = {
      getAnalyticsCategory: getAnalyticsCategory,
      translate: translate,
    };
    return service;

    ////////////////////////////////////////////////////////////////////

    function getAnalyticsCategory (key) {
      switch (key) {
      case 'apiDocumentation':
        return 'API Information for 2015 Edition Products';
      case 'bannedDevelopers':
        return 'Banned Developer';
      case 'correctiveAction':
        return 'Products: Corrective Action Status';
      case 'decertifiedProducts':
        return 'Decertified Products';
      case 'inactiveCertificates':
        return 'Inactive Certificates';
      case 'sed':
        return 'SED Information for 2015 Edition Products';
        // no default
      }
    }

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
        };
        for (var j = 0; j < array[i].acbNames.length; j++) {
          dev.acb.push(array[i].acbNames[j]);
        }
        ret.push(dev);
      }
      return ret;
    }

    /*
     * Listings are part of this collection if:
     * - Surveillance Count > 0 or Direct Review Count > 0
     * - at least one of:
     *   - Open Surveillance NC Count > 0
     *   - Closed Surveillance NC Count > 0
     *   - Open Direct Review NC Count > 0
     *   - Closed Direct Review NC Count > 0
     */
    function correctiveActions (array) {
      return array
        .filter(l => (l.surveillanceCount > 0 || l.directReviewCount > 0)
                && (l.openSurveillanceNonConformityCount > 0
                    || l.closedSurveillanceNonConformityCount > 0
                    || l.openDirectReviewNonConformityCount > 0
                    || l.closedDirectReviewNonConformityCount > 0))
        .map(l => {
          l.mainSearch = [l.developer, l.product, l.version, l.chplProductNumber].join('|');
          l.edition = l.edition + (l.curesUpdate ? ' Cures Update' : '');
          l.nonconformities = angular.toJson({
            openNonConformityCount: l.openSurveillanceNonConformityCount + l.openDirectReviewNonConformityCount,
            closedNonConformityCount: l.closedSurveillanceNonConformityCount + l.closedDirectReviewNonConformityCount,
          });
          return l;
        });
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
          cp.edition = cp.edition + (cp.curesUpdate ? ' Cures Update' : '');

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
          cp.edition = cp.edition + (cp.curesUpdate ? ' Cures Update' : '');
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
  }
})();
