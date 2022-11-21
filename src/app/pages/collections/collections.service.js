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
        // no default
      }
    }

    function translate(key, data) {
      switch (key) {
        case 'correctiveAction':
          return correctiveActions(data.results);
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
  }
}());
