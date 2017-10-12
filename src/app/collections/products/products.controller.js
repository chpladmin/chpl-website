(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('DecertifiedProductsController', DecertifiedProductsController);

    /** @ngInject */
    function DecertifiedProductsController (networkService) {
        var vm = this;

        vm.getMeaningfulUseUsersAccurateAsOfDate = getMeaningfulUseUsersAccurateAsOfDate;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'edition', display: 'Edition', sortType: 'single' },
                { predicate: 'developer', display: 'Developer', sortType: 'single' },
                { predicate: 'product', display: 'Product', sortType: 'single' },
                { predicate: 'version', display: 'Version', sortType: 'single' },
                { predicate: 'decertificationDate', display: 'Decertification Date', sortType: 'single', isDate: true },
                { predicate: 'numMeaningfulUse', display: '# of Known Users', sortType: 'single', nullDisplay: 'Unknown' },
                { predicate: 'acb', display: 'ONC-ACB', sortType: 'single' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'single', sortDefault: true, isLink: true },
                { predicate: 'certificationStatus', display: 'Status', sortType: 'single' },
            ];
            vm.filters = ['acb', 'certificationStatus', 'decertificationDate', 'edition'];
            vm.refineModel = {
                acb: [
                    { value: 'Drummond Group', selected: true },
                    { value: 'ICSA Labs', selected: true },
                    { value: 'InfoGard', selected: true },
                ],
                edition: [
                    { value: '2014', selected: true },
                    { value: '2015', selected: true },
                ],
                certificationStatus: [
                    { value: 'Withdrawn by Developer Under Surveillance/Review', selected: true },
                    { value: 'Withdrawn by ONC-ACB', selected: true },
                    { value: 'Terminated by ONC', selected: true },
                ],
            };

            vm.getMeaningfulUseUsersAccurateAsOfDate();
        }

        function getMeaningfulUseUsersAccurateAsOfDate () {
            networkService.getMeaningfulUseUsersAccurateAsOfDate()
                .then(function (response) {
                    vm.muuAccurateAsOf = response.accurateAsOfDate;
                });
        }
    }
})();
