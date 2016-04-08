;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditDeveloperController', ['$modalInstance', 'activeDeveloper', 'commonService', 'authService', function ($modalInstance, activeDeveloper, commonService, authService) {
            var vm = this;
            vm.developer = angular.copy(activeDeveloper);
            vm.updateDeveloper = {developerIds: [vm.developer.developerId]};

            vm.addressRequired = addressRequired;
            vm.save = save;
            vm.cancel = cancel;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.isAcbAdmin = authService.isAcbAdmin();
                vm.showFormErrors = false;
            }

            function addressRequired () {
                return commonService.addressRequired(vm.developer.address);
            }

            function save () {
                vm.updateDeveloper.developer = vm.developer;
                commonService.updateDeveloper(vm.updateDeveloper)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $modalInstance.close(response);
                        } else {
                            $modalInstance.dismiss('An error occurred');
                        }
                    },function (error) {
                        $modalInstance.dismiss(error.data.error);
                    });
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }
        }]);
})();
