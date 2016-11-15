;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditRequirementController', ['$modalInstance', '$log', 'requirement', 'surveillanceTypes', 'utilService', function ($modalInstance, $log, requirement, surveillanceTypes, utilService) {
            var vm = this;

            vm.cancel = cancel;
            vm.save = save;
            vm.sortRequirement = utilService.sortRequirement;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.requirement = angular.copy(requirement);
                vm.showFormErrors = false;
                vm.data = surveillanceTypes;
                vm.requirement.type = findModel(vm.requirement.type, vm.data.surveillanceRequirementTypes.data);
                vm.requirement.result = findModel(vm.requirement.result, vm.data.surveillanceResultTypes.data);
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function save () {
                $modalInstance.close(vm.requirement);
            }

            ////////////////////////////////////////////////////////////////////

            function findModel (id, array) {
                for (var i = 0; i < array.length; i++) {
                    if (id.id === array[i].id) {
                        id = array[i];
                    }
                };
                return id;
            }
        }]);
})();
