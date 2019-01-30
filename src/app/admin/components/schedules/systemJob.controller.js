(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('SystemJobController', SystemJobController);

    /** @ngInject */
    function SystemJobController ($interval, $log, $uibModalInstance, SPLIT_PRIMARY, job, networkService) {
        var vm = this;

        vm.cancel = cancel;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.job = angular.copy(job);
            vm.selectedDateTime = new Date();
            vm.datePickerOpen = false;

            var tick = function () {
                vm.now = Date.now();
            }
            tick();
            $interval(tick, 1000);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function save () {
            var oneTimeTrigger = {
                job: vm.job,
                runDateMillis: vm.selectedDateTime.getTime(),
            };
            networkService.createScheduleOneTimeTrigger(oneTimeTrigger)
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
        }

        ////////////////////////////////////////////////////////////////////

    }
})();
