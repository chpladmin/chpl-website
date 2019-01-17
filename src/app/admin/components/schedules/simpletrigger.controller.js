(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('SimpleTriggerController', SimpleTriggerController);

    /** @ngInject */
    function SimpleTriggerController ($log, $uibModalInstance, SPLIT_PRIMARY, job, networkService) {
        var vm = this;

        vm.cancel = cancel;
        vm.save = save;
        vm.datePickerOpen = false;
        vm.selectedDateTime = new Date();
        vm.change = change;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            if (vm.trigger.acb) {
                vm.selectedAcb = vm.trigger.acb.split(SPLIT_PRIMARY).map(function (acb) { return {name: acb}; });
            }
            _getAcbs();
            //var tick = function () {
            //    vm.now = Date.now();
            //}
            //tick();
            //$interval(tick, 1000);
            vm.selectedDateTime = new Date();
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function change () {
            $log.info(vm.selectedDateTime);
        }

        function save () {
            /*
            if (vm.trigger.job.jobDataMap.acbSpecific) {
                vm.trigger.acb = vm.selectedAcb.map(function (acb) { return acb.name; }).join(SPLIT_PRIMARY);
            }
            if (vm.trigger.name) {
                networkService.updateScheduleTrigger(vm.trigger)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close({
                                trigger: response,
                                status: 'updated',
                            });
                        } else {
                            vm.errorMessage = response.data.error;
                        }
                    },function (error) {
                        vm.errorMessage = error.data.error;
                    });
            } else {
                networkService.createScheduleTrigger(vm.trigger)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close({
                                trigger: response,
                                status: 'created',
                            });
                        } else {
                            vm.errorMessage = response.data.error;
                        }
                    },function (error) {
                        vm.errorMessage = error.data.error;
                    });
            }
            */
        }

        ////////////////////////////////////////////////////////////////////

        function _getAcbs () {
            networkService.getAcbs(true)
                .then(function (data) {
                    vm.acbs = data.acbs;
                    if (!vm.selectedAcb) {
                        vm.selectedAcb = angular.copy(vm.acbs);
                    }
                });
        }

    }
})();
