(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('IcsFamilyDetailController', IcsFamilyDetailController);

    /** @ngInject */
    function IcsFamilyDetailController ($location, $log, $uibModalInstance, active, listing) {
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
            $location.path('/product/' + vm.listing.id + '/additional');
            $uibModalInstance.close('navigated');
        }
    }
})();
