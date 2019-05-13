(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('ViewSedModalController', ViewSedModalController);

    /** @ngInject */
    function ViewSedModalController ($uibModal, $uibModalInstance, id, networkService) {
        var vm = this;

        vm.close = close;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            networkService.getListing(id)
                .then(function (data) {
                    vm.listing = data;
                });
        }

        function close () {
            $uibModalInstance.close('cancelled');
        }
    }
})();
