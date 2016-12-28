(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('MergeDeveloperController', MergeDeveloperController);

    /** @ngInject */
    function MergeDeveloperController ($uibModalInstance, developers, commonService) {
        var vm = this;

        vm.activate = activate;
        vm.addressRequired = addressRequired;
        vm.save = save;
        vm.cancel = cancel;

        vm.activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.developers = angular.copy(developers);
            vm.developer = angular.copy(vm.developers[0]);
            delete vm.developer.lastModifiedDate;
            delete vm.developer.developerId;
            vm.updateDeveloper = {developerIds: []};
            for (var i = 0; i < vm.developers.length; i++) {
                vm.updateDeveloper.developerIds.push(vm.developers[i].developerId);
            }
            vm.errorMessage = '';
        }

        function addressRequired () {
            return commonService.addressRequired(vm.developer.address);
        }

        function save () {
            vm.updateDeveloper.developer = vm.developer;
            commonService.updateDeveloper(vm.updateDeveloper)
                .then(function (response) {
                    if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                        $uibModalInstance.close(response);
                    } else {
                        vm.errorMessage = response.error;
                    }
                },function (error) {
                    vm.errorMessage = error.data.error;
                });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
