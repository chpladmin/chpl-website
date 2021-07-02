(() => {
  /** @ngInject */
  function InactiveCertificatesController() {
    const vm = this;

    function activate() {
      vm.columnSet = [
        { predicate: 'edition', display: 'Edition', sortType: 'single' },
        {
          predicate: 'developer', display: 'Developer', sortType: 'multi', isDeveloperLink: true,
        },
        { predicate: 'product', display: 'Product', sortType: 'single' },
        { predicate: 'version', display: 'Version', sortType: 'single' },
        {
          predicate: 'decertificationDate', display: 'Inactive As Of', sortType: 'single', isDate: true,
        },
        {
          predicate: 'promotingInteroperabilityUserCount', display: '# of Known Users', sortType: 'single', nullDisplay: 'Unknown',
        },
        {
          predicate: 'promotingInteroperabilityUserDate', display: '# Last Updated Date', sortType: 'single', isDate: true, nullDisplay: 'Unknown',
        },
        { predicate: 'acb', display: 'ONC-ACB', sortType: 'single' },
        {
          predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'single', sortDefault: true, isLink: true,
        },
      ];
      vm.filters = ['acb', 'decertificationDate', 'edition'];
      vm.refineModel = {
        certificationStatus: [
          { value: 'Withdrawn by Developer', selected: true },
        ],
      };
    }

    activate();
  }

  angular.module('chpl.collections')
    .controller('InactiveCertificatesController', InactiveCertificatesController);
})();
