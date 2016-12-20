(function() {
    'use strict';

    angular
        .module('chpl.product')
        .controller('ProductHistoryController', ProductHistoryController);

    /** @ngInject */
    function ProductHistoryController($log, $uibModalInstance, activity) {
        var vm = this;

        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.activity = activity;
        }

        function cancel () {
            $uibModalInstance.dismiss('product history cancelled');
        }
    }
})();
