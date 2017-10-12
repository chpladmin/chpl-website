(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('CorrectiveActionController', CorrectiveActionController);

    /** @ngInject */
    function CorrectiveActionController () {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'edition', display: 'Edition', sortType: 'multi', descendingFirst: true },
                { predicate: 'developer', display: 'Developer', sortType: 'multi' },
                { predicate: 'product', display: 'Product', sortType: 'multi' },
                { predicate: 'version', display: 'Version', sortType: 'multi' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'multi', isLink: true, initialPanel: 'surveillance' },
                { predicate: 'acb', display: 'ONC-ACB', sortType: 'multi' },
                { predicate: 'openNonconformityCount', display: '# Open NCs', sortType: 'multi', descendingFirst: true, sortDefault: ['-openNonconformityCount', '-edition', 'developer'] },
                { predicate: 'closedNonconformityCount', display: '# Closed NCs', sortType: 'multi', descendingFirst: true },
            ];
            vm.filters = ['acb', 'certificationStatus', 'edition', 'nonconformities'];
            vm.refineModel = {
                acb: [
                    { value: 'Drummond Group', selected: true },
                    { value: 'ICSA Labs', selected: true },
                    { value: 'InfoGard', selected: true },
                ],
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
                edition: [
                    { value: '2014', selected: true },
                    { value: '2015', selected: true },
                ],
            };
        }
    }
})();
