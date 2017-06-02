(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('ApiCriteriaController', ApiCriteriaController);

    /** @ngInject */
    function ApiCriteriaController () {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'edition', display: 'Edition' },
                { predicate: 'developer', display: 'Developer' },
                { predicate: 'product', display: 'Product' },
                { predicate: 'version', display: 'Version' },
                { predicate: 'acb', display: 'ONC-ACB' },
                { predicate: 'certificationDate', display: 'Certification Date', isDate: true },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortDefault: true, isLink: true },
                { predicate: 'apiDocumentation', display: 'API Documentation', nullDisplay: 'N/A' },
            ];
            vm.filters = ['acb', 'certificationDate'];
            vm.refineModel = {acb: [
                { value: 'Drummond Group', selected: true },
                { value: 'ICSA Labs', selected: true },
                { value: 'Infogard', selected: true },
            ]};
        }
    }
})();
