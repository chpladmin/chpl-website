(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('ScheduleController', ScheduleController);

    /** @ngInject */
    function ScheduleController ($log, $uibModalInstance, networkService, scheduleJobs, trigger, SPLIT_PRIMARY) {
        var vm = this;

        vm.cancel = cancel;
        vm.deleteTrigger = deleteTrigger;
        vm.onScheduleChange = onScheduleChange;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.trigger = angular.copy(trigger);
            if (!vm.trigger.cronSchedule) {
                vm.trigger.cronSchedule = '0 0 1 1/1 * ? *';
            }
            if (vm.trigger.acb) {
                vm.selectedAcb = vm.trigger.acb.split(SPLIT_PRIMARY).map(function (acb) { return {name: acb}; });
            }
            vm.scheduleJobs = scheduleJobs;
            vm.schConfig = _getScheduleConfig();
            _getAcbs();
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

        function onScheduleChange () {
            vm.schConfig = _getScheduleConfig();
        }

        function save () {
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
        }

        ////////////////////////////////////////////////////////////////////

        function _getAcbs() {
            networkService.getAcbs(true)
                .then(function (data) {
                    vm.acbs = data.acbs;
                    if (!vm.selectedAcb) {
                        vm.selectedAcb = angular.copy(vm.acbs);
                    }
                });
        }

        function _getScheduleConfig () {
            return Object.assign(
                _getTimingRestrictions(vm.trigger.job),
                {
                    formInputClass: '',
                    formSelectClass: '',
                    formRadioClass: '',
                    formCheckboxClass: '',
                    use24HourTime: true,
                });
        }

        function _getTimingRestrictions (job) {
            let ret = {
                hideSeconds: true,
                hideMinutesTab: false,
                hideHourlyTab: false,
            };
            if (job && job.frequency) {
                switch (job.frequency) {
                case 'DAILY':
                    ret.hideHourlyTab = true;
                case 'HOURLY':
                    ret.hideMinutesTab = true;
                    //no default
                }
            }
            return ret;
        }
    }
})();
