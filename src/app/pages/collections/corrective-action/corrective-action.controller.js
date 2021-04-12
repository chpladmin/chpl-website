(function () {
  'use strict';

  angular.module('chpl.collections')
    .controller('CorrectiveActionController', CorrectiveActionController);

  /** @ngInject */
  function CorrectiveActionController () {
    var vm = this;

    vm.developerTransform = developerTransform;
    vm.linkTransform = linkTransform;

    activate();

    ////////////////////////////////////////////////////////////////////

    function activate () {
      vm.columnSet = [
        { predicate: 'edition', display: 'Edition', sortType: 'multi', descendingFirst: true },
        { predicate: 'developer', display: 'Developer', sortType: 'multi', transformFn: vm.developerTransform },
        { predicate: 'product', display: 'Product', sortType: 'multi' },
        { predicate: 'version', display: 'Version', sortType: 'multi' },
        { predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'multi', transformFn: vm.linkTransform },
        { predicate: 'acb', display: 'ONC-ACB', sortType: 'multi' },
        { predicate: 'openSurveillanceNonConformityCount', display: '# Open Surveillance NCs', sortType: 'multi', descendingFirst: true, sortDefault: ['-openNonConformityCount', '-edition', 'developer'] },
        { predicate: 'closedSurveillanceNonConformityCount', display: '# Closed Surveillance NCs', sortType: 'multi', descendingFirst: true },
        { predicate: 'openDirectReviewNonConformityCount', display: '# Open Direct Review NCs', sortType: 'multi', descendingFirst: true },
        { predicate: 'closedDirectReviewNonConformityCount', display: '# Closed Direct Review NCs', sortType: 'multi', descendingFirst: true },
      ];
      vm.filters = ['acb', 'certificationStatus', 'edition', 'nonconformities'];
      vm.refineModel = {
        certificationStatus: [
          { value: 'Active', selected: true },
          { value: 'Suspended by ONC', selected: true },
          { value: 'Suspended by ONC-ACB', selected: true },
          { value: 'Retired', selected: false },
          { value: 'Withdrawn by Developer', selected: false },
          { value: 'Withdrawn by Developer Under Surveillance/Review', selected: false },
          { value: 'Withdrawn by ONC-ACB', selected: false },
          { value: 'Terminated by ONC', selected: false },
        ],
      };
    }

    ////////////////////////////////////////////////////////////////////

    function developerTransform (data, listing) {
      let link = '<a ui-sref="organizations.developers.developer({developerId: ' + listing.developerId + '})">' + data + '</a>';
      //link += '})" analytics-on="click" analytics-event="Go to Listing Details Page" analytics-properties="{ category: \'Products: Corrective Action Status\' }">' + data + '</a>';
      return link;
    }

    function linkTransform (data, listing) {
      let surv = listing.openSurveillanceNonConformityCount > 0 || listing.closedSurveillanceNonConformityCount > 0;
      let dr = listing.openDirectReviewNonConformityCount > 0 || listing.closedDirectReviewNonConformityCount > 0;
      let link = '<a ui-sref="listing({id: ' + listing.id;
      if (surv && dr) {
        link += ', panel: \'compliance\'';
      } else if (surv) {
        link += ', panel: \'surveillance\'';
      } else if (dr) {
        link += ', panel: \'directReviews\'';
      }
      link += '})" analytics-on="click" analytics-event="Go to Listing Details Page" analytics-properties="{ category: \'Products: Corrective Action Status\' }">' + data + '</a>';
      return link;
    }
  }
})();
