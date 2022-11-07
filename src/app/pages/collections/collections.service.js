(function () {
  angular.module('chpl.collections')
    .factory('collectionsService', collectionsService);

  /** @ngInject */
  function collectionsService($log, SPLIT_PRIMARY, SPLIT_SECONDARY, utilService) {
    const service = {
      getAnalyticsCategory,
      translate,
    };
    return service;

    /// /////////////////////////////////////////////////////////////////

    function getAnalyticsCategory(key) {
      switch (key) {
        case 'correctiveAction':
          return 'Products: Corrective Action Status';
        case 'inactiveCertificates':
          return 'Inactive Certificates';
        case 'sed':
          return 'SED Information for 2015 Edition Products';
        // no default
      }
    }

    function translate(key, data) {
      switch (key) {
        case 'correctiveAction':
          return correctiveActions(data.results);
        case 'inactiveCertificates':
          return inactiveCertificates(data.results);
        case 'sed':
          return sed(data.results, data.certificationCriteria);
        // no default
      }
    }

    /// /////////////////////////////////////////////////////////////////
    // translation functions
    /// /////////////////////////////////////////////////////////////////

    /*
     * Listings are part of this collection if they have at least one of:
     *  - Open Surveillance NC Count > 0
     *  - Closed Surveillance NC Count > 0
     *  - Open Direct Review NC Count > 0
     *  - Closed Direct Review NC Count > 0
     */
    function correctiveActions(array) {
      return array
        .filter((l) => l.openSurveillanceNonConformityCount > 0
                    || l.closedSurveillanceNonConformityCount > 0
                    || l.openDirectReviewNonConformityCount > 0
                    || l.closedDirectReviewNonConformityCount > 0)
        .map((l) => {
          l.mainSearch = [l.developer, l.product, l.version, l.chplProductNumber].join('|');
          l.edition += (l.curesUpdate ? ' Cures Update' : '');
          l.nonconformities = angular.toJson({
            openNonConformityCount: l.openSurveillanceNonConformityCount + l.openDirectReviewNonConformityCount,
            closedNonConformityCount: l.closedSurveillanceNonConformityCount + l.closedDirectReviewNonConformityCount,
          });
          return l;
        });
    }

    /*
     * Listings are part of this collection if:
     * - Certification status = Withdrawn by Developer
     */
    function inactiveCertificates(array) {
      return array
        .filter((cp) => cp.certificationStatus === 'Withdrawn by Developer')
        .map((cp) => {
          cp.mainSearch = [cp.developer, cp.product, cp.version, cp.chplProductNumber].join('|');
          cp.edition += (cp.curesUpdate ? ' Cures Update' : '');
          return cp;
        });
    }

    /*
     * Listings are part of this collection if:
     *   they have 170.315 (g)(3)
     */
    function sed(array, certificationCriteria) {
      const applicableCriteria = certificationCriteria
        .filter((cc) => (cc.number === '170.315 (g)(3)' && cc.title === 'Safety-Enhanced Design'))
        .map((cc) => SPLIT_PRIMARY + cc.id + SPLIT_PRIMARY);
      const ret = array.filter((listing) => applicableCriteria.some((id) => (SPLIT_PRIMARY + listing.criteriaMet + SPLIT_PRIMARY).indexOf(id) > -1))
        .map((listing) => {
          listing.mainSearch = [listing.developer, listing.product, listing.version, listing.chplProductNumber].join('|');
          return listing;
        });
      return ret;
    }
  }
}());
