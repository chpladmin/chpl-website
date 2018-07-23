(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('ScheduleController', ScheduleController);

    /** @ngInject */
    function ScheduleController ($log, $uibModalInstance, networkService, scheduleJobs, trigger) {
        var vm = this;

        vm.cancel = cancel;
        vm.deleteTrigger = deleteTrigger;
        vm.onScheduleChange = onScheduleChange;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.trigger = angular.copy(trigger);
            vm.scheduleJobs = scheduleJobs;
            vm.schConfig = _getScheduleConfig();
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
        function onScheduleChange() {
            vm.schConfig = _getScheduleConfig();
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

        function _getScheduleConfig() {
            return {
                hideSeconds: true,
                hideMinutesTab: true,
                hideHourlyTab: _hideHourlyTab(),
                formInputClass: '',
                formSelectClass: '',
                formRadioClass: '',
                formCheckboxClass: '',
                use24HourTime: true,
            };
        }

        function _hideHourlyTab() {
            if (vm.trigger.job && vm.trigger.job.frequency !== 'HOURLY') {
                return true;
            } else {
                return false;
            }
        }
    }
})();
