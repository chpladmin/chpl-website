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
                { predicate: 'edition', display: 'Edition'},
                { predicate: 'developer', display: 'Developer'},
                { predicate: 'product', display: 'Product'},
                { predicate: 'version', display: 'Version'},
                { predicate: 'chplProductNumber', display: 'CHPL Product Number', sortDefault: true, isLink: true},
            ];
        }
    }
})();
