(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('FuzzyEditController', FuzzyEditController);

    /** @ngInject */
    function FuzzyEditController ($uibModalInstance, fuzzyType, networkService) {
        var vm = this;

        vm.cancel = cancel;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.fuzzyType = angular.copy(fuzzyType);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function save () {
            networkService.updateFuzzyType(vm.fuzzyType)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }
    }
})();
