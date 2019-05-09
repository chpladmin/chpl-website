(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('InactiveCertificatesController', InactiveCertificatesController);

    /** @ngInject */
    function InactiveCertificatesController () {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'edition', display: 'Edition', sortType: 'single' },
                { predicate: 'developer', display: 'Developer', sortType: 'single' },
                { predicate: 'product', display: 'Product', sortType: 'single' },
                { predicate: 'version', display: 'Version', sortType: 'single' },
                { predicate: 'decertificationDate', display: 'Inactive As Of', sortType: 'single', isDate: true },
                { predicate: 'numMeaningfulUse', display: '# of Known Users', sortType: 'single', nullDisplay: 'Unknown' },
                { predicate: 'numMeaningfulUseDate', display: '# Last Updated Date', sortType: 'single', isDate: true, nullDisplay: 'Unknown' },
                { predicate: 'acb', display: 'ONC-ACB', sortType: 'single' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'single', sortDefault: true, isLink: true },
            ];
            vm.filters = ['acb', 'decertificationDate', 'edition'];
            vm.refineModel = {
                edition: [
                    { value: '2014', selected: true },
                    { value: '2015', selected: true },
                ],
                certificationStatus: [
                    { value: 'Withdrawn by Developer', selected: true },
                ],
            };
        }
    }
})();
