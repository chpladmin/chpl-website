(function () {
    'use strict';

    angular.module('chpl')
        .controller('ViewSedModalController', ViewSedModalController);

    /** @ngInject */
    function ViewSedModalController ($uibModal, $uibModalInstance, id, networkService) {
        var vm = this;

        vm.close = close;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            networkService.getProduct(id)
                .then(function (data) {
                    vm.listing = data;
                });
        }

        function close () {
            $uibModalInstance.close('cancelled');
        }
    }
})();
