(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('ApiCriteriaController', ApiCriteriaController);

    /** @ngInject */
    function ApiCriteriaController () {
        var vm = this;

        vm.collectionFilter = collectionFilter;

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

        function collectionFilter (results) {
            var ret = [];
            $log.debug('collectionFilter');

            for (var i = 0; i < results.length; i++) {
                if (results[i].edition === '2015') {
                    ret.push(results[i]);
                }
            }

            return ret;
        }
    }
})();
