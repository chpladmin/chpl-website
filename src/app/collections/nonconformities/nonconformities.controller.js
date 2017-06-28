(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('NonconformitiesController', NonconformitiesController);

    /** @ngInject */
    function NonconformitiesController () {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'edition', display: 'Edition', multiSort: true, descendingFirst: true },
                { predicate: 'developer', display: 'Developer', multiSort: true },
                { predicate: 'product', display: 'Product', multiSort: true },
                { predicate: 'version', display: 'Version', multiSort: true },
                { predicate: 'chplProductNumber', display: 'CHPL ID', multiSort: true, isLink: true, initialPanel: 'surveillance' },
                { predicate: 'acb', display: 'ONC-ACB', multiSort: true },
                { predicate: 'openNonconformityCount', display: '# Open NCs', multiSort: true, descendingFirst: true, sortDefault: ['-openNonconformityCount', '-edition', 'developer'] },
                { predicate: 'closedNonconformityCount', display: '# Closed NCs', multiSort: true, descendingFirst: true },
            ];
            vm.filters = ['acb', 'edition'];
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
            };
        }
    }
})();
