(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('DecertifiedProductsController', DecertifiedProductsController);

    /** @ngInject */
    function DecertifiedProductsController () {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'edition', display: 'Edition', sortType: 'single' },
                { predicate: 'developer', display: 'Developer', sortType: 'single' },
                { predicate: 'product', display: 'Product', sortType: 'single' },
                { predicate: 'version', display: 'Version', sortType: 'single' },
                { predicate: 'decertificationDate', display: 'Date', sortType: 'single', isDate: true },
                { predicate: 'numMeaningfulUse', display: '# of Known Users', sortType: 'single', nullDisplay: 'Unknown' },
                { predicate: 'numMeaningfulUseDate', display: '# Last Updated Date', sortType: 'single', isDate: true, nullDisplay: 'Unknown' },
                { predicate: 'acb', display: 'ONC-ACB', sortType: 'single' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'single', sortDefault: true, isLink: true },
                { predicate: 'certificationStatus', display: 'Status', sortType: 'single' },
            ];
            vm.filters = ['acb', 'certificationStatus', 'decertificationDate', 'edition'];
            vm.refineModel = {
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
        }
    }
})();
