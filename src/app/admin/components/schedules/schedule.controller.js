(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('ScheduleController', ScheduleController);

    /** @ngInject */
    function ScheduleController ($log, $uibModalInstance, networkService, scheduleJobs, trigger) {
        var vm = this;

        vm.cancel = cancel;
        vm.deleteTrigger = deleteTrigger;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.trigger = angular.copy(trigger);
            vm.scheduleJobs = scheduleJobs;
            vm.cronConfig = {
                allowMultiple: false,
                quartz: true,
                options: {
                    allowMinute: false,
                },
            };
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function deleteTrigger () {
            networkService.deleteScheduleTrigger(vm.trigger)
                .then(function (response) {
                    if (response.status === 200) {
                        $uibModalInstance.close({
                            status: 'deleted',
                        });
                    } else {
                        vm.errorMessage = response.data.error;
                    }
                },function (error) {
                    vm.errorMessage = error.data.error;
                });
        }

        function save () {
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
        }
    }
})();
