(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('ScheduleController', ScheduleController);

    /** @ngInject */
    function ScheduleController ($interval, $log, $uibModalInstance, SPLIT_PRIMARY, networkService, scheduleJobs, trigger) {
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
                vm.trigger.cronSchedule = _getDefaultCron();
            }
            if (vm.trigger.acb) {
                vm.selectedAcb = vm.trigger.acb.split(SPLIT_PRIMARY).map(function (acb) { return {name: acb}; });
            }
            vm.scheduleJobs = scheduleJobs;
            vm.schConfig = _getScheduleConfig();
            _getAcbs();
            var tick = function () {
                vm.now = Date.now();
            }
            tick();
            $interval(tick, 1000);
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
            vm.trigger.cronSchedule = _getDefaultCron();
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

        function _getAcbs () {
            networkService.getAcbs(true)
                .then(function (data) {
                    vm.acbs = data.acbs;
                    if (!vm.selectedAcb) {
                        vm.selectedAcb = angular.copy(vm.acbs);
                    }
                });
        }

        function _getDefaultCron () {
            let ret = '';
            if (vm.trigger.job && vm.trigger.job.frequency) {
                switch (vm.trigger.job.frequency) {
                case 'MONTHLY':
                    //first day of every month 4am UTC
                    ret = '0 0 4 1 1/1 ? *';
                    break;
                case 'WEEKLY':
                    //every monday at 3am UTC
                    ret = '0 0 3 ? * MON *';
                    break;
                case 'HOURLY':
                    //every hour at 30 minutes past the hour
                    ret = '0 30 0/1 1/1 * ? *';
                    break;
                default:
                    //daily at 4am UTC
                    ret = '0 0 4 1/1 * ? *';
                    break;
                }
            }
            return ret;
        }

        function _getScheduleConfig () {
            return Object.assign(
                _getTimingRestrictions(vm.trigger.job),
                {
                    formInputClass: '',
                    formSelectClass: '',
                    formRadioClass: '',
                    formCheckboxClass: '',
                    //use24HourTime: true,
                });
        }

        function _getTimingRestrictions (job) {
            let ret = {
                hideSeconds: true,
                hideMinutesTab: false,
                hideHourlyTab: false,
                hideDailyTab: false,
            };
            if (job && job.frequency) {
                switch (job.frequency) {
                case 'WEEKLY':
                    ret.hideDailyTab = true;
                    //falls through
                case 'DAILY':
                    ret.hideHourlyTab = true;
                    //falls through
                case 'HOURLY':
                    ret.hideMinutesTab = true;
                    //no default
                }
            }
            return ret;
        }
    }
})();
