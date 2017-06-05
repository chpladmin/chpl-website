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
                { predicate: 'edition', display: 'Edition' },
                { predicate: 'developer', display: 'Developer' },
                { predicate: 'product', display: 'Product' },
                { predicate: 'version', display: 'Version' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortDefault: true, isLink: true },
                { predicate: 'acb', display: 'ONC-ACB' },
                { predicate: 'openNonconformityCount', display: '# Open NCs' },
                { predicate: 'closedNonconformityCount', display: '# Closed NCs' },
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
