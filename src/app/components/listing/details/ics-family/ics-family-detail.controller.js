(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('IcsFamilyDetailController', IcsFamilyDetailController);

    /** @ngInject */
    function IcsFamilyDetailController ($log, $state, $uibModalInstance, active, listing) {
        var vm = this;

        vm.close = close;
        vm.navigate = navigate;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.active = active;
            vm.listing = listing;
        }

        function close () {
            $uibModalInstance.close('closed');
        }

        function navigate () {
            $state.go('listing', {
                id: vm.listing.id,
                panel: 'additional',
            });
            $uibModalInstance.close('navigated');
        }
    }
})();
